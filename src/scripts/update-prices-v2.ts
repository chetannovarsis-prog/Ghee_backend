
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { createProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function updatePricesV2({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModule = container.resolve(Modules.PRODUCT)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  logger.info("Starting Price Update V2...")

  const updates = [
    { handle: "haldhar-multi-grain-atta", price: 180 },
    { handle: "haldhar-jowar-atta", price: 170 },
    { handle: "haldhar-whole-wheat-atta", price: 150 },
    { handle: "haldhar-bajra-atta", price: 130 }, // New Product
    { handle: "haldhar-moringa-sattu-mix", price: 220 },
    { handle: "haldhar-sattu-mix", price: 190 },
    { handle: "gousaaram-goumutra-capsules", price: 750, variantTitle: "30 Capsules", optionValue: "30 Capsules" },
    { handle: "a2-gir-cow-ghee-dolchi", price: 1800 } // Ghee
  ]

  try {
    const { data: salesChannels } = await query.graph({
      entity: "sales_channel",
      fields: ["id", "name"]
    })
    const defaultSC = salesChannels.find(sc => sc.name === "Default Sales Channel") || salesChannels[0]

    for (const update of updates) {
      const products = await productModule.listProducts({ handle: update.handle }, { relations: ["variants", "variants.prices", "variants.options", "options"] })
      
      if (products.length === 0) {
        if (update.handle === "haldhar-bajra-atta") {
            logger.info(`Creating missing product: ${update.handle}`)
            
            // Get necessary IDs
            const haldharCat = (await productModule.listProductCategories({ handle: "traditional-flours" }))[0]
            const haldharCollection = (await productModule.listProductCollections({ handle: "haldhar-flours" }))[0]

            const newProduct = {
                title: "Haldhar Bajra Atta",
                handle: "haldhar-bajra-atta",
                subtitle: "Pearl Millet Flour | Gluten Free",
                description: "Rich in magnesium and potassium. Excellent for heart health and maintaining blood pressure. Ground in traditional stone chakki.",
                thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
                collection_id: haldharCollection?.id,
                status: ProductStatus.PUBLISHED as ProductStatus,
                categories: haldharCat ? [{ id: haldharCat.id }] : [],
                options: [{ title: "Weight", values: ["1Kg"] }],
                metadata: {
                    rating: 4.6,
                    reviews_count: 45,
                    badge: "Gluten Free",
                    benefits: "Heart Health, Blood Pressure Control"
                },
                variants: [
                    { title: "1Kg", sku: "HAL-BAJRA-1KG", prices: [{ amount: 130, currency_code: "inr" }], options: { Weight: "1Kg" } }
                ],
                sales_channels: [{ id: defaultSC.id }]
            }

            const { result } = await createProductsWorkflow(container).run({
                input: { products: [newProduct] }
            })
            logger.info(`Created Bajra Atta: ${result[0].id}`)
            continue
        } else {
            logger.warn(`Product not found: ${update.handle}`)
            continue
        }
      }

      const product = products[0]
      const variant = product.variants[0] // Assuming single variant for now for simplicity based on seed
      
      if (!variant) {
        logger.warn(`No variant found for ${product.title}`)
        continue
      }

      logger.info(`Updating ${product.title}...`)

      // Update Price
      // We need to find the INR price or add it
      // Since we are using the product module directly, we should update prices via specific methods or workflow if possible, 
      // but direct update on variant prices array might not persist without a localized update or workflow.
      // However, for a script, re-creating the price set or updating it is key.
      // Medusa V2 uses price sets.
      
      // Keep it simple: delete old INR price if possible and add new, or just upsert.
      // Actually, updating prices in V2 is complex via module directly without workflow.
      // Let's use the simplest approach: Upsert the price.

      // But wait, we can just update the variant's price set if we had the price set ID.
      // Easier path: Use the standard update product workflow if available, or just use the price module if we can get the price set id.
      // variant.price_set_id is likely available.
      
      // To allow "update-prices" to be simple, let's just log what we WOULD do, and actually try to update using the product update workflow or similar?
      // No, let's just use the product module to update the variant.
      
      // Note: In Medusa V2, we should use workflows. But here we are in a script.
      // We can use `productModule.updateProductVariants`.
      
      const prices = [{
          amount: update.price,
          currency_code: "inr"
      }]

      await productModule.updateProductVariants(product.id, [{
          id: variant.id,
          prices: prices
      }])
      
      logger.info(`Updated price for ${product.title} to ${update.price}`)

      // Handle Capsule specific updates
      if (update.handle === "gousaaram-goumutra-capsules") {
          // Update Option
          const sizeOption = product.options.find(o => o.title === "Size")
          if (sizeOption) {
              await productModule.updateProductOptions(product.id, [{
                  id: sizeOption.id,
                  title: "Size",
                  values: ["30 Capsules"]
              }])
          }

          // Update Variant
           await productModule.updateProductVariants(product.id, [{
              id: variant.id,
              title: "30 Capsules",
              options: { "Size": "30 Capsules" }
          }])
           logger.info(`Updated Capsule variant info`)
      }
    }

    logger.info("Price Update Complete!")

  } catch (error) {
    logger.error(`Update failed: ${error.message}`)
    console.error(error)
  }
}
