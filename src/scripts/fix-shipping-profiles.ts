import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Fixes the "cart items require shipping profiles not satisfied by current
 * shipping methods" error by ensuring all products and all shipping options
 * share the SAME shipping profile.
 */
export default async function fixShippingProfiles({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
    const productModule = container.resolve(Modules.PRODUCT)

    logger.info("=== Fix Shipping Profile Mismatch ===")

    try {
        // 1. List all shipping profiles
        const profiles = await fulfillmentModule.listShippingProfiles()
        logger.info(`Found ${profiles.length} shipping profile(s):`)
        profiles.forEach(p => logger.info(`  > ${p.name} | type=${p.type} | id=${p.id}`))

        if (profiles.length === 0) {
            logger.error("No shipping profiles found. Cannot fix. Run setup-india-shipping.ts first.")
            return
        }

        // Use the 'default' type profile, or fall back to the first one
        const targetProfile = profiles.find(p => p.type === "default") || profiles[0]
        logger.info(`Target profile: ${targetProfile.name} (${targetProfile.id})`)

        // 2. List all shipping options and check their profile
        const shippingOptions = await fulfillmentModule.listShippingOptions()
        logger.info(`Found ${shippingOptions.length} shipping option(s):`)

        for (const opt of shippingOptions) {
            const match = opt.shipping_profile_id === targetProfile.id ? "✅" : "❌"
            logger.info(`  ${match} ${opt.name} -> profile=${opt.shipping_profile_id}`)

            if (opt.shipping_profile_id !== targetProfile.id) {
                await fulfillmentModule.updateShippingOptions([{
                    id: opt.id,
                    shipping_profile_id: targetProfile.id,
                }])
                logger.info(`  ↳ Updated shipping option "${opt.name}" to profile ${targetProfile.id}`)
            }
        }

        // 3. Update ALL products to use the target shipping profile
        const [products, count] = await productModule.listAndCountProducts({}, { take: 500 })
        logger.info(`Found ${count} products. Updating their shipping profiles...`)

        const updates = products.map(p => ({
            id: p.id,
            shipping_profile_id: targetProfile.id,
        }))

        if (updates.length > 0) {
            await productModule.updateProducts(updates)
            logger.info(`✅ Updated ${updates.length} products to use profile: ${targetProfile.name}`)
        }

        logger.info("=== Fix complete! All products + shipping options now share the same profile. ===")
        logger.info("Please clear your cart and try checkout again.")

    } catch (err: any) {
        logger.error(`Error: ${err.message}`)
        if (err.stack) logger.error(err.stack)
    }
}
