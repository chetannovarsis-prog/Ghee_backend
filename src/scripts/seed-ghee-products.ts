import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { 
  createProductsWorkflow, 
  createProductCategoriesWorkflow,
  createCollectionsWorkflow,
//   linkSalesChannelsToProductsWorkflow,
  updateStoresWorkflow,
  createRegionsWorkflow
} from "@medusajs/medusa/core-flows"

export default async function seedGoushaktiProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const storeModule = container.resolve(Modules.STORE)
  
  logger.info("Starting Goushakti Ghee seeding (v4 - INR Support)...")

  try {
    // 1. Get Store and setup INR
    const [store] = await storeModule.listStores()
    logger.info(`Updating store ${store.id} with INR currency...`)
    
    await updateStoresWorkflow(container).run({
      input: {
        selector: { id: store.id },
        update: {
          supported_currencies: [
            { currency_code: "inr", is_default: true },
            { currency_code: "usd" },
            { currency_code: "eur" }
          ]
        }
      }
    })

    // 2. Setup Region for India
    const { result: regions } = await createRegionsWorkflow(container).run({
      input: {
        regions: [
          {
            name: "India",
            currency_code: "inr",
            countries: ["in"],
            payment_providers: ["pp_system_default"]
          }
        ]
      }
    })
    const region = regions[0]
    logger.info(`Created region: ${region.name}`)

    // 3. Get Default Sales Channel
    const { data: salesChannels } = await query.graph({
      entity: "sales_channel",
      fields: ["id", "name"]
    })
    const defaultSC = salesChannels.find(sc => sc.name === "Default Sales Channel") || salesChannels[0]
    logger.info(`Using Sales Channel: ${defaultSC.name} (${defaultSC.id})`)

    // 4. Ensure Categories exist
    const { result: categories } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [
          { name: "A2 Ghee", handle: "a2-ghee", is_active: true },
          { name: "Healthy Combo", handle: "healthy-combo", is_active: true }
        ]
      }
    })

    const a2GheeCat = categories.find(c => c.handle === "a2-ghee")
    const comboCat = categories.find(c => c.handle === "healthy-combo")

    // 5. Ensure Collection exists
    const { result: collections } = await createCollectionsWorkflow(container).run({
      input: {
        collections: [
          { title: "Bilona Ghee", handle: "bilona-ghee" }
        ]
      }
    })
    const bilonaCollection = collections[0]

    // 6. Define Products
    const productsInput = [
      {
        title: "A2 Gir Cow Ghee - Dolchi",
        handle: "a2-gir-cow-ghee-dolchi",
        subtitle: "Traditional Bilona Churned",
        description: "Pure essence of Ayurvedic wellness from forest-grazed Gir cows.",
        thumbnail: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80",
        collection_id: bilonaCollection.id,
        status: ProductStatus.PUBLISHED,
        categories: a2GheeCat ? [{ id: a2GheeCat.id }] : [],
        options: [{ title: "Weight", values: ["500ml", "1L", "2L", "5L"] }],
        metadata: {
          rating: 4.8,
          reviews_count: 661,
          badge: "Top Rated Choice",
          best_price_coupon: "GOU10",
          // Ghee-specific attributes
          purity_percentage: 99.8,
          cow_breed: "Gir",
          processing_method: "Bilona",
          origin: "Gujarat - Gir Forest Region",
          packaging_type: "Glass Jar",
          grass_fed: true,
          organic_certified: true,
          shelf_life_months: 18
        },
        variants: [
          { title: "500ml", sku: "GIR-500", prices: [{ amount: 1800, currency_code: "inr" }], options: { Weight: "500ml" } },
          { title: "1L", sku: "GIR-1L", prices: [{ amount: 2350, currency_code: "inr" }], options: { Weight: "1L" } },
          { title: "5L", sku: "GIR-5L", prices: [{ amount: 10913, currency_code: "inr" }], options: { Weight: "5L" } }
        ],
        sales_channels: [{ id: defaultSC.id }]
      },
      {
        title: "Bilona-Churned Desi Buffalo Ghee",
        handle: "bilona-churned-buffalo-ghee",
        subtitle: "Pure White Ayurvedic Ghee",
        description: "Rich, creamy texture and superior nutrition.",
        thumbnail: "https://images.unsplash.com/photo-1631709497146-a239ef373cf1?auto=format&fit=crop&w=800&q=80",
        collection_id: bilonaCollection.id,
        status: ProductStatus.PUBLISHED,
        categories: a2GheeCat ? [{ id: a2GheeCat.id }] : [],
        options: [{ title: "Weight", values: ["500ml", "1L", "5L"] }],
        metadata: {
          rating: 4.4,
          reviews_count: 195,
          badge: "Best Seller",
          best_price_coupon: "PURE5",
          // Ghee-specific attributes
          purity_percentage: 99.2,
          cow_breed: "Buffalo",
          processing_method: "Bilona",
          origin: "Rajasthan - Dairy Farms",
          packaging_type: "Glass Jar",
          grass_fed: true,
          organic_certified: false,
          shelf_life_months: 15
        },
        variants: [
          { title: "500ml", sku: "BUF-500", prices: [{ amount: 850, currency_code: "inr" }], options: { Weight: "500ml" } },
          { title: "1L", sku: "BUF-1L", prices: [{ amount: 1600, currency_code: "inr" }], options: { Weight: "1L" } },
          { title: "5L", sku: "BUF-5L", prices: [{ amount: 6548, currency_code: "inr" }], options: { Weight: "5L" } }
        ],
        sales_channels: [{ id: defaultSC.id }]
      },
      {
        title: "Ghee Giants Combo - 5L + 5L",
        handle: "ghee-giants-combo",
        subtitle: "Double the Purity",
        description: "5L A2 Gir Cow Ghee + 5L Desi Buffalo Ghee.",
        thumbnail: "https://images.unsplash.com/photo-1541093113199-a2e93a238628?auto=format&fit=crop&w=800&q=80",
        collection_id: bilonaCollection.id,
        status: ProductStatus.PUBLISHED,
        categories: comboCat ? [{ id: comboCat.id }] : [],
        options: [{ title: "Pack", values: ["Combo Pack"] }],
        metadata: {
          rating: 4.9,
          reviews_count: 202,
          badge: "Goushakti Exclusive",
          best_price_coupon: "GIANT15",
          // Ghee-specific attributes for combo
          purity_percentage: 99.5,
          cow_breed: "Mixed",
          processing_method: "Bilona",
          origin: "Multi-source Premium Selection",
          packaging_type: "Glass Jar",
          grass_fed: true,
          organic_certified: true,
          shelf_life_months: 18
        },
        variants: [
          { title: "Combo Pack", sku: "COMBO-G", prices: [{ amount: 16653, currency_code: "inr" }], options: { Pack: "Combo Pack" } }
        ],
        sales_channels: [{ id: defaultSC.id }]
      }
    ]

    const { result: createdProducts } = await createProductsWorkflow(container).run({
      input: { products: productsInput }
    })
    logger.info(`SUCCESS: Created ${createdProducts.length} Goushakti products!`)

  } catch (error) {
    logger.error(`Seed failed: ${error.message}`)
    console.error(error)
  }
}
