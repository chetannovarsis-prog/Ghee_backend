import { Client } from "pg"

/**
 * Fixes the "cart items require shipping profiles not satisfied by current
 * shipping methods" error by directly updating the database via raw SQL.
 *
 * Uses the same pattern as fix-payment-provider-constraint.ts which works
 * reliably on Render. The ORM-based approach silently ignores shipping_profile_id
 * on products because it's managed through Medusa's link module.
 */
export default async function fixShippingProfiles({ container }) {
    const logger = container.resolve("logger")

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
        logger.error("[fix-shipping] DATABASE_URL is not set. Cannot proceed.")
        return
    }

    const client = new Client({ connectionString: databaseUrl })

    try {
        await client.connect()
        logger.info("[fix-shipping] Connected to database.")

        // Step 1: Show all shipping profiles
        const profileResult = await client.query(`
            SELECT id, name, type
            FROM shipping_profile
            WHERE deleted_at IS NULL
            ORDER BY type
        `)

        logger.info(`[fix-shipping] Found ${profileResult.rows.length} shipping profile(s):`)
        profileResult.rows.forEach(p =>
            logger.info(`  → ${p.type.padEnd(10)} | ${p.name} | ${p.id}`)
        )

        if (profileResult.rows.length === 0) {
            logger.error("[fix-shipping] No shipping profiles found! Cannot fix.")
            return
        }

        // Pick the 'default' type profile, or fall back to the first one
        const targetProfile =
            profileResult.rows.find(p => p.type === "default") || profileResult.rows[0]
        logger.info(`[fix-shipping] Target profile: "${targetProfile.name}" (${targetProfile.id})`)

        // Step 2: Show current shipping options and their profiles
        const optResult = await client.query(`
            SELECT id, name, shipping_profile_id
            FROM shipping_option
            WHERE deleted_at IS NULL
        `)
        logger.info(`[fix-shipping] Found ${optResult.rows.length} shipping option(s):`)
        optResult.rows.forEach(o =>
            logger.info(`  ${o.shipping_profile_id === targetProfile.id ? "✅" : "❌"} "${o.name}" → ${o.shipping_profile_id}`)
        )

        // Step 3: Update ALL shipping options to target profile (raw SQL)
        const updateOptionsResult = await client.query(`
            UPDATE shipping_option
            SET shipping_profile_id = $1, updated_at = NOW()
            WHERE deleted_at IS NULL
              AND shipping_profile_id != $1
        `, [targetProfile.id])
        logger.info(`[fix-shipping] Updated ${updateOptionsResult.rowCount} shipping option(s) to target profile.`)

        // Step 4: Show current products and their profiles
        const prodResult = await client.query(`
            SELECT id, title, shipping_profile_id
            FROM product
            WHERE deleted_at IS NULL
            ORDER BY title
        `)
        logger.info(`[fix-shipping] Found ${prodResult.rows.length} product(s):`)
        prodResult.rows.forEach(p =>
            logger.info(`  ${p.shipping_profile_id === targetProfile.id ? "✅" : "❌"} "${p.title}" → ${p.shipping_profile_id}`)
        )

        // Step 5: Update ALL products to target profile (raw SQL)
        const updateProdsResult = await client.query(`
            UPDATE product
            SET shipping_profile_id = $1, updated_at = NOW()
            WHERE deleted_at IS NULL
        `, [targetProfile.id])
        logger.info(`[fix-shipping] Updated ${updateProdsResult.rowCount} product(s) to target profile.`)

        logger.info("[fix-shipping] ✅ Fix complete! All products and shipping options now share the same profile.")
        logger.info("[fix-shipping] Clear your cart and try checkout again.")

    } catch (err: any) {
        logger.error(`[fix-shipping] Error: ${err.message}`)
        if (err.stack) logger.error(err.stack)
    } finally {
        await client.end()
    }
}
