import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkShippingProfiles({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const db = container.resolve(ContainerRegistrationKeys.DB)

  logger.info("Checking products with shipping profiles...")

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "title", "shipping_profile_id"]
  })

  const productsWithShippingProfile = products.filter(p => p.shipping_profile_id)
  
  logger.info(`\nFound ${productsWithShippingProfile.length} products with shipping profiles:`)
  console.table(productsWithShippingProfile.map(p => ({
    title: p.title,
    shipping_profile_id: p.shipping_profile_id
  })))

  logger.info("\nChecking available shipping options...")
  const { data: shippingOptions } = await query.graph({
    entity: "shipping_option",
    fields: ["id", "name", "shipping_profile_id", "status"]
  })

  logger.info(`Found ${shippingOptions.length} shipping options`)
  console.table(shippingOptions.map(s => ({
    name: s.name,
    profile_id: s.shipping_profile_id,
    status: s.status
  })))

  if (shippingOptions.length === 0 && productsWithShippingProfile.length > 0) {
    logger.warn("\n⚠️  WARNING: Products have shipping profiles but NO shipping options are available!")
    logger.warn("This will cause cart completion to fail.")
    logger.info("\nTo fix this, either:")
    logger.info("1. Clear shipping_profile_id from all products, OR")
    logger.info("2. Create shipping methods in your backend")
  }
}
