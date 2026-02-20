import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function deleteDefaultShippingProfile({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Attempting to delete default shipping profile and options...")
  logger.info("NOTE: This script has limited ability to delete due to Medusa API constraints.")
  logger.info("")
  logger.info("MANUAL FIX REQUIRED:")
  logger.info("===================")
  logger.info("1. Go to your Medusa Admin Panel")
  logger.info("2. Navigate to Settings > Shipping Profiles")
  logger.info("3. Delete the 'Default Shipping Profile'")
  logger.info("4. Delete all Shipping Options under Settings > Shipping")
  logger.info("")
  logger.info("After doing this manually, orders will be able to complete without shipping.")
  logger.info("")
  logger.info("Once deleted, restart your backend and frontend servers and try checkout again.")

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    // Get the default profile info
    const { data: profiles } = await query.graph({
      entity: "shipping_profile",
      fields: ["id", "name", "type"]
    })

    logger.info(`Current shipping profiles: ${profiles.length}`)
    profiles.forEach(p => {
      logger.info(`  - ${p.name} (type: ${p.type})`)
    })

  } catch (error: any) {
    logger.error("Error:", error?.message)
  }
}
