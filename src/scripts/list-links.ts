
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function listLinks({ container }) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("Listing links between Region and Payment Provider...")

    try {
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name", "payment_providers.*"],
        })

        regions.forEach(region => {
            logger.info(`Region: ${region.name} (${region.id})`)
            if (region.payment_providers) {
                region.payment_providers.forEach(p => {
                    logger.info(`  - Linked Provider: ${p.id}`)
                })
            } else {
                logger.info("  - No linked providers found.")
            }
        })

    } catch (err) {
        logger.error(`Error listing links: ${err.message}`)
        if (err.stack) logger.error(err.stack)
    }
}
