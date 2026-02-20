
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { deleteRegionsWorkflow } from "@medusajs/medusa/core-flows"

export default async function cleanupRegions({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const regionModule = container.resolve(Modules.REGION)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  logger.info("Starting Cleanup: Removing Europe region and renaming fulfillment set...")

  try {
    // 1. Delete Europe region
    const [europeRegion] = await regionModule.listRegions({ name: "Europe" })
    if (europeRegion) {
      logger.info(`Deleting Europe region: ${europeRegion.id}`)
      await deleteRegionsWorkflow(container).run({
        input: { ids: [europeRegion.id] }
      })
      logger.info("Europe region deleted successfully.")
    } else {
      logger.info("Europe region not found, skipping deletion.")
    }

    // 2. Rename Fulfillment Set
    const [fulfillmentSet] = await fulfillmentModule.listFulfillmentSets({
      name: "European Warehouse delivery",
    })
    if (fulfillmentSet) {
      logger.info(`Renaming fulfillment set: ${fulfillmentSet.id}`)
      await fulfillmentModule.updateFulfillmentSets({
        id: fulfillmentSet.id,
        name: "India Warehouse delivery"
      })
      logger.info("Fulfillment set renamed to 'India Warehouse delivery'.")
    } else {
      logger.info("Fulfillment set 'European Warehouse delivery' not found.")
    }

    logger.info("Cleanup COMPLETE!")
  } catch (err) {
    logger.error(`Error during cleanup: ${err.message}`)
    if (err.stack) {
        logger.error(err.stack)
    }
  }
}
