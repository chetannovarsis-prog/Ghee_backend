
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkRegionPayment({ container }) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("Checking India region payment providers...")

    try {
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name", "currency_code", "payment_providers.*"],
            filters: { name: "India" }
        })

        if (regions.length === 0) {
            logger.error("India region not found.")
            return
        }

        const india = regions[0]
        logger.info(`Region: ${india.name} (${india.currency_code})`)
        logger.info("Associated Payment Providers:")
        if (india.payment_providers && india.payment_providers.length > 0) {
            india.payment_providers.forEach(p => {
                logger.info(`- ID: ${p.id}`)
            })
        } else {
            logger.info("No payment providers associated with this region.")
        }

    } catch (err) {
        logger.error(`Error checking region payments: ${err.message}`)
    }
}
