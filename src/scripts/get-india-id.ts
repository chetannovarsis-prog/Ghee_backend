import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function getRegionId({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
    filters: {
      name: ["India"]
    }
  })

  if (regions.length > 0) {
    logger.info(`ID for India region: ${regions[0].id}`)
  } else {
    logger.error("India region not found")
  }
}
