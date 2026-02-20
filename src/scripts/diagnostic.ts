
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function diagnostic({ container }) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("--- Payment Diagnostic ---")

    try {
        // 1. All Providers
        const { data: providers } = await query.graph({
            entity: "payment_provider",
            fields: ["id", "is_enabled"]
        })
        logger.info("Registered Providers:")
        providers.forEach(p => logger.info(`- ${p.id} (Enabled: ${p.is_enabled})`))

        // 2. India Region Links
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name", "payment_providers.id"],
            filters: { name: "India" }
        })

        if (regions.length > 0) {
            const region = regions[0]
            logger.info(`Region: ${region.name} (${region.id})`)
            logger.info("Linked Providers:")
            if (region.payment_providers) {
                region.payment_providers.forEach(p => logger.info(`  - ${p.id}`))
            } else {
                logger.info("  - None")
            }
        } else {
            logger.error("India region not found!")
        }

    } catch (err) {
        logger.error(`Diagnostic failed: ${err.message}`)
    }
}
