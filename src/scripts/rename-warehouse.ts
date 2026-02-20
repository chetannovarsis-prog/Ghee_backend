import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

import * as fs from "fs"

export default async function renameWarehouse({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  logger.info("Starting Warehouse Renaming...")

  try {
    const allLocations = await stockLocationModule.listStockLocations({})
    const allSets = await fulfillmentModule.listFulfillmentSets({}, { relations: ["service_zones"] })
    
    fs.writeFileSync("rename_debug.json", JSON.stringify({ allLocations, allSets }, null, 2))
    
    // 1. Rename Stock Location
    const sloc = allLocations.find(l => l.name === "European Warehouse")

    if (sloc) {
      await stockLocationModule.updateStockLocations(sloc.id, {
        name: "India Warehouse",
      })
      logger.info(`Renamed Stock Location ${sloc.id} to "India Warehouse"`)
    } else {
      logger.info('Stock Location "European Warehouse" not found.')
    }

    // 2. Rename Fulfillment Set and Service Zones
    const targetFS = allSets.find(fs => fs.name?.toLowerCase().includes("european") || fs.name?.toLowerCase().includes("india"))

    if (targetFS) {
      if (targetFS.name !== "India Warehouse delivery") {
        await fulfillmentModule.updateFulfillmentSets({
          id: targetFS.id,
          name: "India Warehouse delivery",
        })
        logger.info(`Renamed Fulfillment Set ${targetFS.id} to "India Warehouse delivery"`)
      }

      if (targetFS.service_zones) {
        for (const zone of targetFS.service_zones) {
          if (zone.name === "Europe") {
            await fulfillmentModule.deleteServiceZones(zone.id)
            logger.info(`Deleted Service Zone "Europe" (${zone.id})`)
          } else if (zone.name === "India") {
             // Ensure it's named India (it already is)
             logger.info(`Service Zone "India" already exists (${zone.id})`)
          }
        }
      }
    } else {
      logger.info('Fulfillment Set containing "European" or "India" not found.')
    }

    logger.info("Warehouse Renaming COMPLETE!")
  } catch (err) {
    logger.error(`Error during Warehouse Renaming: ${err.message}`)
    throw err
  }
}
