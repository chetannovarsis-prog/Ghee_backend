
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function debugCartPayments({ container }) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const cartModule = container.resolve(Modules.CART)
    const paymentModule = container.resolve(Modules.PAYMENT)

    logger.info("Debugging Cart Payment Sessions...")

    try {
        // 1. Get India region
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name", "currency_code"],
            filters: { name: "India" }
        })

        if (regions.length === 0) {
            logger.error("India region not found.")
            return
        }
        const region = regions[0]

        // 2. Create a temporary cart
        const cart = await cartModule.createCarts({
            region_id: region.id,
            currency_code: region.currency_code,
            items: []
        })
        logger.info(`Created test cart: ${cart.id}`)

        // 3. Check for payment providers from the store API perspective
        const { data: providers } = await query.graph({
            entity: "payment_provider",
            fields: ["id", "is_enabled"],
        })
        logger.info("All registered providers:")
        providers.forEach(p => logger.info(`- ${p.id} (Enabled: ${p.is_enabled})`))

        // 4. Try to list payment methods for this region (simulating storefront)
        // In V2, we check if they are linked
        const { data: regionProviders } = await query.graph({
            entity: "region",
            fields: ["payment_providers.*"],
            filters: { id: region.id }
        })
        
        logger.info(`Payment providers linked to India region (${region.id}):`)
        regionProviders[0].payment_providers.forEach(p => logger.info(`- ${p.id}`))

    } catch (err) {
        logger.error(`Error debugging cart payments: ${err.message}`)
        if (err.stack) logger.error(err.stack)
    }
}
