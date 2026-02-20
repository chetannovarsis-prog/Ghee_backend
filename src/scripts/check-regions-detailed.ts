import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkRegionsDetailed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code", "countries.iso_2"]
  })

  logger.info(`Found ${regions.length} regions:`)
  console.table(regions.map(r => ({
    name: r.name,
    currency: r.currency_code,
    countries: r.countries?.map(c => c!.iso_2).join(", ")
  })))
}
