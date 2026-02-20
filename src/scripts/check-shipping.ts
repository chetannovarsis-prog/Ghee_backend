
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function checkShipping({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)

  const profiles = await fulfillmentModule.listShippingProfiles()
  logger.info(`Found ${profiles.length} shipping profiles:`)
  console.log(JSON.stringify(profiles, null, 2))
}
