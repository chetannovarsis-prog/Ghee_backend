import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"

export default async function completeSeed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModule = container.resolve(Modules.PRODUCT)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const link = container.resolve(ContainerRegistrationKeys.LINK)

  logger.info("Completing Goushakti Seeding...")

  try {
    const [sc] = await salesChannelModule.listSalesChannels({ name: "Default Sales Channel" })
    const collection = (await productModule.listProductCollections({ handle: "bilona-ghee" }))[0]
    const a2GheeCat = (await productModule.listProductCategories({ handle: "a2-ghee" }))[0]
    const comboCat = (await productModule.listProductCategories({ handle: "healthy-combo" }))[0]

    const productsToSeed = [
      {
        title: "Bilona-Churned Desi Buffalo Ghee",
        handle: "bilona-churned-buffalo-ghee",
        status: ProductStatus.PUBLISHED,
        collection_id: collection.id,
        thumbnail: "https://images.unsplash.com/photo-1631709497146-a239ef373cf1?auto=format&fit=crop&w=800&q=80",
        options: [{ title: "Weight", values: ["500ml", "1L", "5L"] }],
        variants: [
          { title: "500ml", sku: "BUF-500", options: { Weight: "500ml" }, prices: [{ amount: 850, currency_code: "inr" }] },
          { title: "1L", sku: "BUF-1L", options: { Weight: "1L" }, prices: [{ amount: 1600, currency_code: "inr" }] },
          { title: "5L", sku: "BUF-5L", options: { Weight: "5L" }, prices: [{ amount: 4949, currency_code: "inr" }] }
        ]
      },
      {
        title: "Ghee Giants Combo - 5L + 5L",
        handle: "ghee-giants-combo",
        status: ProductStatus.PUBLISHED,
        collection_id: collection.id,
        thumbnail: "https://images.unsplash.com/photo-1541093113199-a2e93a238628?auto=format&fit=crop&w=800&q=80",
        options: [{ title: "Pack", values: ["Combo Pack"] }],
        variants: [
          { title: "Combo Pack", sku: "COMBO-G", options: { Pack: "Combo Pack" }, prices: [{ amount: 16653, currency_code: "inr" }] }
        ]
      }
    ]

    for (const prodInput of productsToSeed) {
      const p = await productModule.createProducts(prodInput)
      logger.info(`Product created: ${p.title} (${p.id})`)
      
      if (sc) {
        await link.create({
          [Modules.PRODUCT]: { product_id: p.id },
          [Modules.SALES_CHANNEL]: { sales_channel_id: sc.id }
        })
      }
    }

    logger.info("SEEDING COMPLETE!")

  } catch (err) {
    logger.error(`Seed failed: ${err.message}`)
  }
}
