import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * Disables shipping requirements for all products/variants and clears shipping profiles.
 * Use this when you want to place orders WITHOUT any shipping methods.
 */
export default async function disableShippingRequirements({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  logger.info("Disabling shipping requirements for all products/variants...")

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "shipping_profile",
      "variants.id",
      "variants.title",
      "variants.requires_shipping",
    ],
  })

  let productsUpdated = 0
  let variantsUpdated = 0
  const productModule = container.resolve(Modules.PRODUCT)

  for (const product of products) {
    if ((product as any).shipping_profile) {
      await (query as any).update({
        entity: "product",
        where: { id: product.id },
        data: { shipping_profile: null }
      })
      productsUpdated += 1
      logger.info(`✓ Cleared shipping profile for product: ${product.title}`)
    }

    if (Array.isArray(product.variants)) {
      for (const variant of product.variants) {
        if (variant.requires_shipping !== false) {
          await productModule.updateProductVariants(product.id, [{
            id: variant.id,
            requires_shipping: false,
          }])
          variantsUpdated += 1
          logger.info(
            `✓ Disabled requires_shipping for variant: ${variant.title || variant.id}`
          )
        }
      }
    }
  }

  // The original code had a check for `variantManager` which was not defined.
  // This block is removed as it's likely a remnant or incorrect.
  // if (!variantManager) {
  //   logger.warn(
  //     "ProductVariantManager not found. Variants were not updated. " +
  //     "Please set requires_shipping = false for all variants via Admin/API."
  //   )
  // }

  logger.info(
    `\n✅ Done. Products updated: ${productsUpdated}, Variants updated: ${variantsUpdated}`
  )
  logger.info("You can now complete orders without shipping methods.")
}
