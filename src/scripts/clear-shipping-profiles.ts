import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function clearShippingProfiles({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Checking products and shipping options...")

  // Check if there are any shipping methods
  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name"]
  })

  if (shippingOptions.length > 0) {
    logger.info(`Found ${shippingOptions.length} shipping options. No changes needed.`)
    return
  }

  logger.info("No shipping options found. Clearing shipping_profile_id from all products...")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "shipping_profile"]
  })

  const productsWithShipping = products.filter(p => (p as any).shipping_profile)

  logger.info(`Clearing shipping profile from ${productsWithShipping.length} products...`)

  try {
    // Update each product to remove shipping_profile_id
    for (const product of productsWithShipping) {
      await (query as any).update({
        entity: "product",
        where: { id: product.id },
        data: { shipping_profile: null }
      })
      logger.info(`✓ Cleared shipping profile from: ${product.title}`)
    }

    logger.info(`\n✅ Successfully cleared shipping profiles from ${productsWithShipping.length} products`)
    logger.info("Orders can now be completed without shipping methods configured.")
  } catch (error) {
    logger.error("Failed to clear shipping profiles:", error)
  }
}
