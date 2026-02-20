import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function deleteAllShippingDirectly({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("=== DELETING ALL SHIPPING PROFILES AND OPTIONS ===\n")

  try {
    // Step 1: Get all shipping options
    logger.info("Step 1: Fetching all shipping options...")
    const { data: shippingOptions } = await query.graph({
      entity: "shipping_option",
      fields: ["id", "name"]
    })
    logger.info(`Found ${shippingOptions?.length || 0} shipping options`)
    shippingOptions?.forEach((opt: any) => {
      logger.info(`  - ${opt.name} (${opt.id})`)
    })

    // Step 2: Get all shipping profiles  
    logger.info("\nStep 2: Fetching all shipping profiles...")
    const { data: shippingProfiles } = await query.graph({
      entity: "shipping_profile",
      fields: ["id", "name", "type"]
    })
    logger.info(`Found ${shippingProfiles?.length || 0} shipping profiles`)
    shippingProfiles?.forEach((prof: any) => {
      logger.info(`  - ${prof.name} (type: ${prof.type}, id: ${prof.id})`)
    })

    logger.info("\n⚠️  Manual Deletion Required:")
    logger.info("=============================")
    logger.info("Unfortunately, the Medusa Query API doesn't provide delete methods.")
    logger.info("")
    logger.info("To delete shipping profiles without admin access, use SQL directly:")
    logger.info("")
    logger.info("If using SQLite (.db file):")
    logger.info("  1. Open your database file (usually storage.db)")
    logger.info("  2. Open in SQLite viewer or use command line:")
    logger.info("     sqlite3 storage.db")
    logger.info("  3. Run these SQL commands:")
    logger.info("     DELETE FROM shipping_option;")
    logger.info("     DELETE FROM shipping_profile;")
    logger.info("")
    logger.info("If using PostgreSQL/MySQL:")
    logger.info("  1. Connect to your database")
    logger.info("  2. Execute the same DELETE statements above")
    logger.info("")
    logger.info("Alternative: Clear the entire database and restart with fresh seed!")

  } catch (error: any) {
    logger.error("Error:", error?.message || String(error))
  }
}
