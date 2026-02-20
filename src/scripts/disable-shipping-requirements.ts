import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

/**
 * Disables shipping requirements for all products/variants and clears shipping profiles.
 * Use this when you want to place orders WITHOUT any shipping methods.
 */
export default async function disableShippingRequirements({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const db = container.resolve(ContainerRegistrationKeys.DB)

  logger.info("Disabling shipping requirements for all products/variants...")

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "title",
      "shipping_profile_id",
      "variants.id",
      "variants.title",
      "variants.requires_shipping",
    ],
  })

  const productManager = (db.managers as any).ProductManager
  const variantManager = (db.managers as any).ProductVariantManager

  let productsUpdated = 0
  let variantsUpdated = 0

  for (const product of products) {
    if (product.shipping_profile_id) {
      await productManager.update(product.id, {
        shipping_profile_id: null,
      })
      productsUpdated += 1
      logger.info(`✓ Cleared shipping profile for product: ${product.title}`)
    }

    if (variantManager && Array.isArray(product.variants)) {
      for (const variant of product.variants) {
        if (variant.requires_shipping !== false) {
          await variantManager.update(variant.id, {
            requires_shipping: false,
          })
          variantsUpdated += 1
          logger.info(
            `✓ Disabled requires_shipping for variant: ${variant.title || variant.id}`
          )
        }
      }
    }
  }

  if (!variantManager) {
    logger.warn(
      "ProductVariantManager not found. Variants were not updated. " +
        "Please set requires_shipping = false for all variants via Admin/API."
    )
  }

  logger.info(
    `\n✅ Done. Products updated: ${productsUpdated}, Variants updated: ${variantsUpdated}`
  )
  logger.info("You can now complete orders without shipping methods.")
}
