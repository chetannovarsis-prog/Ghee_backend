import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkCollectionMembership({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "collection_id", "collection.title"]
  })

  logger.info("Product Collection Membership:")
  products.forEach(p => {
    logger.info(`- ${p.title} (${p.handle}): Collection ID: ${p.collection_id}, Collection Title: ${p.collection?.title || 'None'}`)
  })
}
