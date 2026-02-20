import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function updateShippingPrice({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
    const pricingModuleService = container.resolve(Modules.PRICING)

    // Get all shipping options
    const shippingOptions = await fulfillmentModuleService.listShippingOptions()
    logger.info(`Found ${shippingOptions.length} shipping options:`)
    shippingOptions.forEach((opt: any) => logger.info(`  - ${opt.name} (${opt.id})`))

    // Get associated price sets
    const { data: shippingOptionPriceSets } = await container
        .resolve(ContainerRegistrationKeys.QUERY)
        .graph({
            entity: "shipping_option",
            fields: ["id", "name", "prices.*", "prices.id", "prices.amount", "prices.currency_code"],
        })

    logger.info("Shipping option prices:")
    for (const opt of shippingOptionPriceSets as any[]) {
        logger.info(`  ${opt.name}: ${JSON.stringify(opt.prices?.map((p: any) => ({ amount: p.amount, currency: p.currency_code })))}`)
    }

    // Update all shipping option prices to 0
    for (const opt of shippingOptionPriceSets as any[]) {
        if (opt.prices?.length > 0) {
            for (const price of opt.prices) {
                try {
                    await pricingModuleService.updatePrices([
                        {
                            id: price.id,
                            amount: 0,
                        },
                    ])
                    logger.info(`✅ Updated price ${price.id} (${price.currency_code}) to 0`)
                } catch (e: any) {
                    logger.error(`Failed to update price ${price.id}: ${e.message}`)
                }
            }
        }
    }

    logger.info("Done! All shipping prices updated to ₹0 (Free Shipping)")
}
