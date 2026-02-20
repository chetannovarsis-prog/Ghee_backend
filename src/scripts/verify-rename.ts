import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import * as fs from "fs"

export default async function verifyRename({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const stockLocationModule = container.resolve(Modules.STOCK_LOCATION)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  logger.info("Verifying Warehouse Names...")

  const locations = await stockLocationModule.listStockLocations({})
  const fulfillmentSets = await fulfillmentModule.listFulfillmentSets({}, {
    relations: ["service_zones"]
  })
  
  fs.writeFileSync("final_state.json", JSON.stringify({ locations, fulfillmentSets }, null, 2))
  logger.info("Verification report saved to final_state.json")
}
