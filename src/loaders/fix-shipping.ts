import { Client } from "pg"
import { LoaderOptions } from "@medusajs/framework/types"

/**
 * Startup loader: auto-discovered by Medusa from src/loaders/
 * Uses raw SQL to ensure all products and shipping options share the same
 * shipping profile, preventing the cart completion error:
 * "The cart items require shipping profiles not satisfied by shipping methods"
 */
export default async function fixShippingProfileLoader({ container }: LoaderOptions) {
    const logger = container.resolve("logger")

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
        logger?.warn("[fix-shipping] DATABASE_URL not set, skipping.")
        return
    }

    const client = new Client({ connectionString: databaseUrl })

    try {
        await client.connect()

        // Find the default shipping profile
        const { rows: profiles } = await client.query(`
            SELECT id, name, type FROM shipping_profile
            WHERE deleted_at IS NULL ORDER BY type LIMIT 1
        `)

        if (profiles.length === 0) {
            logger?.debug("[fix-shipping] No shipping profiles found, skipping.")
            await client.end()
            return
        }

        // Prefer 'default' type — pick it if it's first, else take what we have
        const { rows: allProfiles } = await client.query(`
            SELECT id, name, type FROM shipping_profile WHERE deleted_at IS NULL
        `)
        const target = allProfiles.find(p => p.type === "default") || allProfiles[0]

        // Update shipping options
        const opts = await client.query(`
            UPDATE shipping_option SET shipping_profile_id = $1, updated_at = NOW()
            WHERE deleted_at IS NULL AND shipping_profile_id != $1
        `, [target.id])

        // Update products
        const prods = await client.query(`
            UPDATE product SET shipping_profile_id = $1, updated_at = NOW()
            WHERE deleted_at IS NULL AND (shipping_profile_id != $1 OR shipping_profile_id IS NULL)
        `, [target.id])

        if (opts.rowCount && opts.rowCount > 0)
            logger?.info(`[fix-shipping] Fixed ${opts.rowCount} shipping option(s) → "${target.name}"`)
        if (prods.rowCount && prods.rowCount > 0)
            logger?.info(`[fix-shipping] Fixed ${prods.rowCount} product(s) → "${target.name}"`)
        if (!opts.rowCount && !prods.rowCount)
            logger?.debug("[fix-shipping] All shipping profiles already aligned. ✅")

    } catch (err: any) {
        logger?.warn(`[fix-shipping] Loader error: ${err.message}`)
    } finally {
        try { await client.end() } catch { }
    }
}
