
export default async function simplifiedLink({ container }) {
    const remoteLink = container.resolve("remoteLink")
    const query = container.resolve("query")
    const logger = container.resolve("logger")

    logger.info("--- Simplified Linking Process ---")

    try {
        // 1. Get India region
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name"],
            filters: { name: "India" }
        })

        if (!regions || regions.length === 0) {
            logger.error("India region not found.")
            return
        }
        const regionId = regions[0].id
        logger.info(`Found India region: ${regionId}`)

        const providers = ["pp_system_default", "pp_razorpay_razorpay"]

        for (const providerId of providers) {
            try {
                logger.info(`Linking ${providerId} to ${regionId}...`)
                await remoteLink.create([
                    {
                        region: {
                            region_id: regionId,
                        },
                        payment: {
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

        logger.info("--- Process Finished ---")

    } catch (err) {
        logger.error(`Error in simplifiedLink: ${err.message}`)
    }
}
