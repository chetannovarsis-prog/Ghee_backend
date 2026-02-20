import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function fixProductImages({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Fixing product images with refreshed Unsplash URLs...")

  const productImagesMap: Record<string, string> = {
    "haldhar-jowar-atta": "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
    "haldhar-multi-grain-atta": "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?q=80&w=1000&auto=format&fit=crop",
    "haldhar-whole-wheat-atta": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1000&auto=format&fit=crop",
    "haldhar-moringa-sattu-mix": "https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=1000&auto=format&fit=crop",
    "gousaaram-goumutra-capsules": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop",
    "haldhar-sattu-mix": "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=1000&auto=format&fit=crop",
    "haldhar-moong-multigrain-atta": "https://images.unsplash.com/photo-1515544832961-29243da5955f?q=80&w=1000&auto=format&fit=crop"
  }

  try {
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "handle"]
    })

    const updates: any[] = []
    for (const product of products) {
      if (productImagesMap[product.handle]) {
        updates.push({
          id: product.id,
          thumbnail: productImagesMap[product.handle],
          images: [{ url: productImagesMap[product.handle] }]
        })
      }
    }

    if (updates.length > 0) {
      await updateProductsWorkflow(container).run({
        input: {
          products: updates
        }
      })
      logger.info(`SUCCESS: Updated images for ${updates.length} products.`)
    } else {
      logger.info("No products found to update.")
    }

  } catch (error) {
    logger.error(`Update failed: ${error.message}`)
    console.error(error)
  }
}
