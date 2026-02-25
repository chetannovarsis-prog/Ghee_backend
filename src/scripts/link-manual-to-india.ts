
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function linkManualToIndia({ container }) {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("Linking manual payment provider to India region...")

    try {
        // Get India region
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name"],
            filters: { name: "India" }
        })

        if (regions.length === 0) {
            logger.error("India region not found. Make sure a region named 'India' exists.")
            return
        }

        const regionId = regions[0].id
        logger.info(`Found India region: ${regionId}`)

        // Link manual provider to region
        // The provider id registered in config is 'manual' so Medusa creates 'pp_manual_manual'
        await remoteLink.create([
            {
                [Modules.REGION]: {
                    region_id: regionId,
                },
                [Modules.PAYMENT]: {
                    payment_provider_id: "pp_manual_manual",
                },
            },
        ])

        logger.info(`Successfully linked pp_manual_manual to India region!`)

    } catch (err: any) {
        // If already linked, that's fine
        if (err.message?.includes("duplicate") || err.message?.includes("unique")) {
            logger.info("Manual payment provider is already linked to India region.")
        } else {
            logger.error(`Error linking manual provider: ${err.message}`)
            if (err.stack) logger.error(err.stack)
        }
    }
}
