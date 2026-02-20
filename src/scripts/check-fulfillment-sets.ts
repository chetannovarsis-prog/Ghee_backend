
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function checkFulfillmentSets({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  const sets = await fulfillmentModule.listFulfillmentSets({}, { relations: ["service_zones", "service_zones.geo_zones"] })

  logger.info(`Found ${sets.length} fulfillment sets:`)
  console.log(JSON.stringify(sets, null, 2))
}
