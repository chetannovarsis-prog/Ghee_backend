
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { IModuleService } from "@medusajs/framework/types"

export default async function checkProviders({ container }) {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("Checking registered payment providers...")

    try {
        const { data: providers } = await query.graph({
            entity: "payment_provider",
            fields: ["id", "is_enabled"]
        })

        logger.info("Registered Payment Providers:")
        providers.forEach(p => {
            logger.info(`- ID: ${p.id}, Enabled: ${p.is_enabled}`)
        })
    } catch (err) {
        logger.error(`Error checking providers: ${err.message}`)
    }
}
