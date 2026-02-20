import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkCollections({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: collections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title", "handle"]
  })

  logger.info(`Found ${collections.length} collections:`)
  console.table(collections)
}
