
import * as Utils from "@medusajs/framework/utils"

export default async function checkModules({ container }) {
    const logger = container.resolve(Utils.ContainerRegistrationKeys.LOGGER)

    logger.info("--- Checking Medusa Constants ---")
    
    logger.info("Modules object keys:")
    logger.info(Object.keys(Utils.Modules).join(", "))

    logger.info(`Modules.REGION: ${Utils.Modules.REGION}`)
    logger.info(`Modules.PAYMENT: ${Utils.Modules.PAYMENT}`)

    logger.info("ContainerRegistrationKeys object keys:")
    logger.info(Object.keys(Utils.ContainerRegistrationKeys).join(", "))

    logger.info("--- End of Check ---")
}
