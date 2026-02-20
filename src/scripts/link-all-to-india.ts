
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function linkAllToIndia({ container }) {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("--- Starting Linking Process ---")

    try {
        // 1. Find the India region
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name"],
            filters: { name: "India" }
        })

        if (!regions || regions.length === 0) {
            logger.error("Could not find a region named 'India'.")
            return
        }

        const regionId = regions[0].id
        logger.info(`Found India region with ID: ${regionId}`)

        const providersToLink = [
            { id: "pp_system_default", label: "COD" },
            { id: "pp_razorpay_razorpay", label: "Razorpay" }
        ]

        for (const provider of providersToLink) {
            logger.info(`Attempting to link ${provider.label} (${provider.id})...`)
            try {
                await remoteLink.create([
                    {
                        [Modules.REGION]: {
                            region_id: regionId,
                        },
                        [Modules.PAYMENT]: {
                            payment_provider_id: provider.id,
                        },
                    },
                ])
                logger.info(`Successfully linked ${provider.id}`)
            } catch (error) {
                if (error.message.includes("already exists") || error.code === "23505") {
                    logger.info(`${provider.id} is already linked to this region.`)
                } else {
                    logger.error(`Failed to link ${provider.id}: ${error.message}`)
                    console.error(error)
                }
            }
        }

        logger.info("--- Linking Process Finished ---")

    } catch (err) {
        logger.error(`Critical error during linking: ${err.message}`)
        console.error(err)
    }
}
