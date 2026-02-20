
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function linkRazorpayToIndia({ container }) {
    const remoteLink = container.resolve(ContainerRegistrationKeys.REMOTE_LINK)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("Linking Razorpay to India region...")

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

        // 2. Link region to razorpay provider
        // In Medusa v2, regions are linked to payment providers via a link
        // The link is usually Module.REGION -> Module.PAYMENT
        
        await remoteLink.create([
            {
                [Modules.REGION]: {
                    region_id: regionId,
                },
                [Modules.PAYMENT]: {
                    payment_provider_id: "pp_razorpay_razorpay",
                },
            },
        ])

        logger.info(`Successfully linked pp_razorpay_razorpay to region: ${regions[0].name}`)

    } catch (err) {
        logger.error(`Error linking Razorpay: ${err.message}`)
        if (err.stack) logger.error(err.stack)
    }
}
