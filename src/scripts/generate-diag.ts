import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import fs from "fs"

export default async function generateDiag({ container }: ExecArgs) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "status", "collection.title", "sales_channels.name"]
  })

  const { data: collections } = await query.graph({
    entity: "product_collection",
    fields: ["id", "title", "handle"]
  })

  const report = {
    productCount: products.length,
    collectionCount: collections.length,
    products: products.map(p => ({
      title: p.title,
      status: p.status,
      collection: p.collection?.title,
      sales_channels: p.sales_channels?.map(sc => sc.name)
    })),
    collections: collections
  }

  fs.writeFileSync("diag.json", JSON.stringify(report, null, 2))
}
