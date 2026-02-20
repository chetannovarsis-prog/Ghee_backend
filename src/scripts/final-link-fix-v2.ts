
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function finalLinkFixV2({ container }) {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const regionModule = container.resolve(Modules.REGION)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("Executing Final Link Fix V2 for India region...")

    try {
        // 1. Get India region using region module directly
        const regions = await regionModule.listRegions({
            name: "India"
        })

        if (regions.length === 0) {
            logger.error("India region not found.")
            return
        }
        const regionId = regions[0].id
        logger.info(`Found India region: ${regionId}`)

        const providers = ["pp_system_default", "pp_razorpay_razorpay"]

        // 2. Link each provider
        for (const providerId of providers) {
            try {
                logger.info(`Linking ${providerId} to ${regionId}...`)
                // In V2, the link is between Region and PaymentProvider
                // The key for PaymentProvider link is usually just 'payment' or 'payment_provider'
                // However, the standard Link definition is Region -> PaymentProvider
                
                await remoteLink.create([
                    {
                        [Modules.REGION]: {
                            region_id: regionId,
                        },
                        [Modules.PAYMENT]: {
                            payment_provider_id: providerId,
                        },
                    },
                ])
                logger.info(`Successfully linked ${providerId}`)
            } catch (err) {
                if (err.message.includes("already exists") || (err.code && err.code === "23505")) {
                    logger.info(`${providerId} is already linked.`)
                } else {
                    logger.error(`Error linking ${providerId}: ${err.message}`)
                }
            }
        }

        logger.info("Final Link Fix V2 completed.")

    } catch (err) {
        logger.error(`Error in finalLinkFixV2: ${err.message}`)
        if (err.stack) logger.error(err.stack)
    }
}
