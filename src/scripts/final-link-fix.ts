
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function finalLinkFix({ container }) {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("Executing Final Link Fix for India region...")

    try {
        // 1. Get India region
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name"],
            filters: { name: "India" }
        })

        if (regions.length === 0) {
            logger.error("India region not found.")
            return
        }
        const regionId = regions[0].id
        logger.info(`Found India region: ${regionId}`)

        const providers = ["pp_system_default", "pp_razorpay_razorpay"]

        // 2. Link each provider
        // We use remoteLink.create which should handle the link creation
        // If they already exist, we'll catch the error
        
        for (const providerId of providers) {
            try {
                logger.info(`Linking ${providerId} to ${regionId}...`)
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
                if (err.message.includes("already exists") || err.code === "23505") {
                    logger.info(`${providerId} is already linked.`)
                } else {
                    logger.error(`Error linking ${providerId}: ${err.message}`)
                }
            }
        }

        // 3. Final Verification check (simplified)
        const { data: finalCheck } = await query.graph({
            entity: "region",
            fields: ["id", "name", "payment_providers.id"],
            filters: { id: regionId }
        })
        
        logger.info("Final linked providers for India:")
        if (finalCheck[0].payment_providers) {
            finalCheck[0].payment_providers.forEach(p => logger.info(`- ${p.id}`))
        } else {
            logger.info("- No providers found after link attempt.")
        }

    } catch (err) {
        logger.error(`Error in finalLinkFix: ${err.message}`)
        if (err.stack) logger.error(err.stack)
    }
}
