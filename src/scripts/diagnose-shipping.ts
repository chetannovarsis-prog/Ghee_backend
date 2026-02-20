import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function diagnoseShippingIssue({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("=== SHIPPING DIAGNOSIS ===\n")

  try {
    // Check products with variants
    logger.info("1. Checking PRODUCTS WITH VARIANTS...")
    const { data: products } = await query.graph({
      entity: "product",
      fields: ["id", "title", "shipping_profile", "variants.id", "variants.title", "variants.shipping_profile"]
    })

    logger.info(`Found ${products.length} total products`)
    products.forEach(p => {
      logger.info(`  Product: ${p.title} (product profile: ${(p as any).shipping_profile || "null"})`)
      if (p.variants && p.variants.length > 0) {
        p.variants.forEach(v => {
          logger.info(`    - Variant: ${v.title} (variant profile: ${(v as any).shipping_profile || "null"})`)
        })
      }
    })

    // Check shipping profiles
    logger.info("\n2. Checking SHIPPING PROFILES...")
    const { data: profiles } = await query.graph({
      entity: "shipping_profile",
      fields: ["id", "name", "type"]
    })

    logger.info(`Found ${profiles.length} shipping profiles`)
    profiles.forEach(p => {
      logger.info(`  - ${p.name} (id: ${p.id}, type: ${p.type})`)
    })

    // Check shipping options
    logger.info("\n3. Checking SHIPPING OPTIONS...")
    const { data: options } = await query.graph({
      entity: "shipping_option",
      fields: ["id", "name", "shipping_profile", "region_id"]
    })

    logger.info(`Found ${options.length} shipping options`)
    options.forEach(o => {
      logger.info(`  - ${o.name} (id: ${o.id}, profile: ${(o as any).shipping_profile})`)
    })

    logger.info("\n=== DIAGNOSIS COMPLETE ===")

  } catch (error: any) {
    logger.error("Error during diagnosis:", error?.message || String(error))
  }
}
