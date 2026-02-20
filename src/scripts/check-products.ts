import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "handle", "categories.name", "collection.title"]
  })

  logger.info(`Found ${products.length} products:`)
  console.table(products.map(p => ({
    title: p.title,
    categories: p.categories?.map(c => c.name).join(", "),
    collection: p.collection?.title || "None"
  })))
}
