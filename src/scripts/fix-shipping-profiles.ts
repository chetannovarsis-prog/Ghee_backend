import { Client } from "pg"
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * Fixes the "cart items require shipping profiles not satisfied" error.
 * 
 * - shipping_option.shipping_profile_id: updated via raw SQL (direct column)
 * - product → shipping_profile link: updated via updateProductsWorkflow (link table)
 */
export default async function fixShippingProfiles({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
    const productModule = container.resolve(Modules.PRODUCT)

    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) {
        logger.error("[fix-shipping] DATABASE_URL not set")
        return
    }

    logger.info("[fix-shipping] Starting...")

    // ── 1. Find the default shipping profile via Medusa module ──────────────────
    const allProfiles = await fulfillmentModule.listShippingProfiles()
    logger.info(`[fix-shipping] Found ${allProfiles.length} shipping profile(s):`)
    allProfiles.forEach((p: any) => logger.info(`  → [${p.type}] "${p.name}" | ${p.id}`))

    if (allProfiles.length === 0) {
        logger.error("[fix-shipping] No profiles found. Run setup-india-shipping.ts first.")
        return
    }

    const targetProfile = allProfiles.find((p: any) => p.type === "default") || allProfiles[0]
    logger.info(`[fix-shipping] Target profile: "${targetProfile.name}" (${targetProfile.id})`)

    // ── 2. Update shipping_option via raw SQL (HAS the column directly) ─────────
    const client = new Client({ connectionString: databaseUrl })
    try {
        await client.connect()

        const optResult = await client.query(`
            UPDATE shipping_option
            SET shipping_profile_id = $1, updated_at = NOW()
            WHERE deleted_at IS NULL
        `, [targetProfile.id])
        logger.info(`[fix-shipping] Updated ${optResult.rowCount} shipping option(s) → "${targetProfile.name}"`)

        // Also log current shipping options for diagnostics
        const opts = await client.query(`SELECT id, name, shipping_profile_id FROM shipping_option WHERE deleted_at IS NULL`)
        opts.rows.forEach(o => logger.info(`  so: "${o.name}" → profile=${o.shipping_profile_id}`))

    } finally {
        await client.end()
    }

    // ── 3. Update product → shipping_profile LINK via updateProductsWorkflow ────
    // This is the correct Medusa v2 approach - the workflow handles the link table
    const [products] = await productModule.listAndCountProducts({}, { take: 500 })
    logger.info(`[fix-shipping] Found ${products.length} product(s). Updating links...`)

    if (products.length > 0) {
        try {
            await updateProductsWorkflow(container).run({
                input: {
                    products: products.map((p: any) => ({
                        id: p.id,
                        shipping_profile_id: targetProfile.id,
                    }))
                }
            })
            logger.info(`[fix-shipping] ✅ Updated ${products.length} product(s) via workflow.`)
        } catch (err: any) {
            logger.error(`[fix-shipping] Workflow error: ${err.message}`)
            // Fallback: try remoteLink directly
            logger.info("[fix-shipping] Trying remoteLink fallback...")
            const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
            for (const p of products) {
                try {
                    await remoteLink.create([{
                        [Modules.PRODUCT]: { product_id: p.id },
                        [Modules.FULFILLMENT]: { shipping_profile_id: targetProfile.id },
                    }])
                    logger.info(`  → Linked product ${p.id} → ${targetProfile.id}`)
                } catch (linkErr: any) {
                    if (linkErr.message?.includes("already exists") || linkErr.code === "23505") {
                        logger.info(`  → Already linked: ${p.id}`)
                    } else {
                        logger.warn(`  → Link failed for ${p.id}: ${linkErr.message}`)
                    }
                }
            }
        }
    }

    logger.info("[fix-shipping] ✅ Done! Clear your cart and try checkout again.")
}
