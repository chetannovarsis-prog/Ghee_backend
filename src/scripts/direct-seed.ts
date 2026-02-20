import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"

export default async function directSeed({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModule = container.resolve(Modules.PRODUCT)
  const salesChannelModule = container.resolve(Modules.SALES_CHANNEL)
  const storeModule = container.resolve(Modules.STORE)
  const regionModule = container.resolve(Modules.REGION)

  logger.info("Starting Direct Seeding (v2 - Correct Methods)...")

  try {
    // 1. Setup INR
    const [store] = await storeModule.listStores()
    await storeModule.updateStores(store.id, {
      supported_currencies: [
        { currency_code: "inr", is_default: true }
      ]
    })
    logger.info("Store updated with INR")

    // 2. Setup Region
    const regions = await regionModule.listRegions({ name: "India" })
    let region = regions[0]
    if (!region) {
      region = await regionModule.createRegions({
        name: "India",
        currency_code: "inr",
        countries: ["in"]
      })
      logger.info("Region India created")
    }

    // 3. Setup Collection
    let collection = (await productModule.listProductCollections({ handle: "bilona-ghee" }))[0]
    if (!collection) {
      collection = await productModule.createProductCollections({
        title: "Bilona Ghee",
        handle: "bilona-ghee"
      })
      logger.info("Collection created")
    }

    // 4. Create Category
    let category = (await productModule.listProductCategories({ handle: "a2-ghee" }))[0]
    if (!category) {
      category = await productModule.createProductCategories({
        name: "A2 Ghee",
        handle: "a2-ghee",
        is_active: true
      })
      logger.info("Category created")
    }

    // 5. Create Product
    const p = await productModule.createProducts({
      title: "A2 Gir Cow Ghee - Dolchi",
      handle: "a2-gir-cow-ghee-dolchi",
      status: ProductStatus.PUBLISHED,
      collection_id: collection.id,
      thumbnail: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80",
      options: [{ title: "Weight", values: ["500ml", "1L"] }],
      variants: [
        { 
          title: "500ml", 
          sku: "GIR-500-D", 
          options: { Weight: "500ml" }
        }
      ]
    })
    logger.info(`Product created: ${p.id}`)

    // 6. Link to Sales Channel
    const [sc] = await salesChannelModule.listSalesChannels({ name: "Default Sales Channel" })
    if (sc) {
      const link = container.resolve(ContainerRegistrationKeys.LINK)
      await link.create({
        [Modules.PRODUCT]: { product_id: p.id },
        [Modules.SALES_CHANNEL]: { sales_channel_id: sc.id }
      })
      logger.info("Product linked to Sales Channel")
    }

    logger.info("DIRECT SEED SUCCESS!")

  } catch (err) {
    logger.error(`Direct seed failed: ${err.message}`)
    console.error(err)
  }
}
