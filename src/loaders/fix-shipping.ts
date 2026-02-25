import { LoaderOptions } from "@medusajs/framework/types"
import { Modules } from "@medusajs/framework/utils"

/**
 * Startup loader: auto-discovered by Medusa from src/loaders/
 * Ensures all products and all shipping options share the same shipping profile
 * so cart completion doesn't fail with:
 * "The cart items require shipping profiles not satisfied by the current shipping methods"
 */
export default async function fixShippingProfileLoader({ container }: LoaderOptions) {
    const logger = container.resolve("logger")

    try {
        const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
        const productModule = container.resolve(Modules.PRODUCT)

        // 1. Get all shipping profiles
        const profiles = await fulfillmentModule.listShippingProfiles({}, {})
        if (profiles.length === 0) {
            logger?.debug("[fix-shipping] No shipping profiles found, skipping.")
            return
        }

        // Prefer 'default' type, otherwise use first
        const target = profiles.find((p: any) => p.type === "default") || profiles[0]
        logger?.debug(`[fix-shipping] Using profile: "${target.name}" (${target.id})`)

        // 2. Align ALL shipping options to target profile
        const opts = await fulfillmentModule.listShippingOptions({}, {})
        const mismatchedOpts = opts.filter((o: any) => o.shipping_profile_id !== target.id)
        if (mismatchedOpts.length > 0) {
            await fulfillmentModule.updateShippingOptions(
                mismatchedOpts.map((o: any) => ({ id: o.id, shipping_profile_id: target.id }))
            )
            logger?.info(`[fix-shipping] Fixed ${mismatchedOpts.length} shipping option(s).`)
        }

        // 3. Align ALL products to target profile
        const [products] = await productModule.listAndCountProducts({}, { take: 500 })
        const mismatchedProducts = products.filter(
            (p: any) => p.shipping_profile_id !== target.id
        )
        if (mismatchedProducts.length > 0) {
            await productModule.updateProducts(
                mismatchedProducts.map((p: any) => ({
                    id: p.id,
                    shipping_profile_id: target.id,
                }))
            )
            logger?.info(`[fix-shipping] Fixed ${mismatchedProducts.length} product(s).`)
        }

        if (mismatchedOpts.length === 0 && mismatchedProducts.length === 0) {
            logger?.debug("[fix-shipping] All shipping profiles already aligned. ✅")
        }

    } catch (err: any) {
        // Non-fatal: don't crash the server
        logger?.warn(`[fix-shipping] Could not auto-fix shipping profiles: ${err.message}`)
    }
}
