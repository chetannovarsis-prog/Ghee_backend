import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function removeShippingFromProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Starting to remove shipping profiles from all products...")

  try {
    // Get all products with shipping profiles
    logger.info("Fetching products with shipping profiles...")
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "shipping_profile_id"]
    })

    const productsWithShipping = products.filter(p => p.shipping_profile_id)
    logger.info(`Found ${productsWithShipping.length} products with shipping profiles`)

    if (productsWithShipping.length === 0) {
      logger.info("No products have shipping profiles. Nothing to update.")
      return
    }

    // Update products using the query service
    logger.info("Updating products to remove shipping profiles...")
    
    for (const product of productsWithShipping) {
      await query.update([
        {
          entity: "product",
          where: { id: product.id },
          data: { shipping_profile_id: null }
        }
      ])
      logger.info(`✓ Updated: ${product.title}`)
    }
    
    logger.info(`✅ Successfully cleared shipping_profile_id from ${productsWithShipping.length} products`)
    logger.info("Orders can now be completed without shipping method configuration.")
  } catch (error: any) {
    logger.error("Error:", error?.message || String(error))
  }
}
