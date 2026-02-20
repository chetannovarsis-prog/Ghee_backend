import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { 
  createProductsWorkflow, 
  createProductCategoriesWorkflow,
  createCollectionsWorkflow
} from "@medusajs/medusa/core-flows"

export default async function seedHaldharProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  
  logger.info("Starting Haldhar Traditional Products seeding...")

  try {
    // 1. Get Default Sales Channel
    const { data: salesChannels } = await query.graph({
      entity: "sales_channel",
      fields: ["id", "name"]
    })
    const defaultSC = salesChannels.find(sc => sc.name === "Default Sales Channel") || salesChannels[0]
    logger.info(`Using Sales Channel: ${defaultSC.name} (${defaultSC.id})`)

    // 2. Ensure Category exists
    const { result: categories } = await createProductCategoriesWorkflow(container).run({
      input: {
        product_categories: [
          { name: "Traditional Flours & Health", handle: "traditional-flours", is_active: true }
        ]
      }
    })
    const haldharCat = categories.find(c => c.handle === "traditional-flours")

    // 3. Ensure Collection exists
    const { result: collections } = await createCollectionsWorkflow(container).run({
      input: {
        collections: [
          { title: "Haldhar Traditional Flours", handle: "haldhar-flours" }
        ]
      }
    })
    const haldharCollection = collections[0]

    // 4. Define Products
    const productsInput = [
      {
        title: "Haldhar Jowar Atta",
        handle: "haldhar-jowar-atta",
        subtitle: "Natural Pre-Washed Grains | Bull Driven Chakki",
        description: "India's First Natural Pre-Washed Jowar Atta, ground in traditional bull-driven stone chakki to preserve nutrients. High in fiber, aids digestion and promotes gut health.",
        thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
        collection_id: haldharCollection.id,
        status: ProductStatus.PUBLISHED,
        categories: haldharCat ? [{ id: haldharCat.id }] : [],
        options: [{ title: "Weight", values: ["1Kg"] }],
        metadata: {
          rating: 4.8,
          reviews_count: 124,
          badge: "Preservative Free",
          processing: "Bull Driven Stone Chakki",
          grains: "100% Jowar"
        },
        variants: [
          { title: "1Kg", sku: "HAL-JOWAR-1KG", prices: [{ amount: 170, currency_code: "inr" }], options: { Weight: "1Kg" } }
        ],
        sales_channels: [{ id: defaultSC.id }]
      },
      {
        title: "Haldhar Multi Grain Atta",
        handle: "haldhar-multi-grain-atta",
        subtitle: "Wheat, Chana & Barley Mix | Low Glycemic Index",
        description: "A nutritious blend of 40% Wheat, 40% Chana, and 20% Barley. Pre-washed and ground in bull-driven stone chakki. Rich in protein and high fiber.",
        thumbnail: "https://images.unsplash.com/photo-1586444248902-2f64eddf13cb?auto=format&fit=crop&w=800&q=80",
        collection_id: haldharCollection.id,
        status: ProductStatus.PUBLISHED,
        categories: haldharCat ? [{ id: haldharCat.id }] : [],
        options: [{ title: "Weight", values: ["1Kg"] }],
        metadata: {
          rating: 4.9,
          reviews_count: 85,
          badge: "High Protein",
          composition: "40% Wheat, 40% Chana, 20% Barley"
        },
        variants: [
          { title: "1Kg", sku: "HAL-MULTI-1KG", prices: [{ amount: 180, currency_code: "inr" }], options: { Weight: "1Kg" } }
        ],
        sales_channels: [{ id: defaultSC.id }]
      },
      {
        title: "Haldhar Whole Wheat Atta",
        handle: "haldhar-whole-wheat-atta",
        subtitle: "100% Organic | Non-GMO",
        description: "Pure whole wheat atta ground in bull-driven stone chakki. 100% Atta with no mix, carefully pre-washed with clean water to ensure maximum purity.",
        thumbnail: "https://images.unsplash.com/photo-1544473244-f6895a69ad41?auto=format&fit=crop&w=800&q=80",
        collection_id: haldharCollection.id,
        status: ProductStatus.PUBLISHED,
        categories: haldharCat ? [{ id: haldharCat.id }] : [],
        options: [{ title: "Weight", values: ["1Kg"] }],
        metadata: {
          rating: 4.7,
          reviews_count: 210,
          badge: "100% Organic"
        },
        variants: [
          { title: "1Kg", sku: "HAL-WHEAT-1KG", prices: [{ amount: 150, currency_code: "inr" }], options: { Weight: "1Kg" } }
        ],
        sales_channels: [{ id: defaultSC.id }]
      },
      {
        title: "Haldhar Moringa Sattu Mix",
        handle: "haldhar-moringa-sattu-mix",
        subtitle: "Health Drink Mix | Sugar Control",
        description: "A potent health mix containing Roasted Gram Flour (795g), Moringa Powder (150g), Pomegranate Seeds (50g), and Black Pepper (5g). Excellent for blood sugar management.",
        thumbnail: "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?auto=format&fit=crop&w=800&q=80",
        collection_id: haldharCollection.id,
        status: ProductStatus.PUBLISHED,
        categories: haldharCat ? [{ id: haldharCat.id }] : [],
        options: [{ title: "Weight", values: ["500g"] }],
        metadata: {
          rating: 5.0,
          reviews_count: 42,
          badge: "Superfood",
          benefits: "Vitamins A, C, E, Iron & Good Absorption"
        },
        variants: [
          { title: "500g", sku: "HAL-MORINGA-500G", prices: [{ amount: 220, currency_code: "inr" }], options: { Weight: "500g" } }
        ],
        sales_channels: [{ id: defaultSC.id }]
      },
      {
        title: "Gousaaram Goumutra Capsules",
        handle: "gousaaram-goumutra-capsules",
        subtitle: "Pure Desi Cow Urine Powder",
        description: "Traditionally known to protect vital organs. Acts as a natural alkalizer, promotes immunity and vitality. Manufactured using modern technology for pure health.",
        thumbnail: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
        collection_id: haldharCollection.id,
        status: ProductStatus.PUBLISHED,
        categories: haldharCat ? [{ id: haldharCat.id }] : [],
        options: [{ title: "Size", values: ["30 Capsules"] }],
        metadata: {
          rating: 4.8,
          reviews_count: 320,
          badge: "Ayush Certified",
          benefits: "Detoxification, Sound Sleep, Sugar Metabolism"
        },
        variants: [
          { title: "30 Capsules", sku: "HAL-CAPS-30", prices: [{ amount: 750, currency_code: "inr" }], options: { Size: "30 Capsules" } }
        ],
        sales_channels: [{ id: defaultSC.id }]
      },
      {
        title: "Haldhar Sattu",
        handle: "haldhar-sattu-mix",
        subtitle: "Natural Coolant | Energy Booster",
        description: "Roasted Gram Flour (Sattu) with Jeera and Ajwain. A natural coolant that provides sustained energy and aids digestion. Perfect for hydrating summer drinks.",
        thumbnail: "https://images.unsplash.com/photo-1626074353765-517a681e40be?auto=format&fit=crop&w=800&q=80",
        collection_id: haldharCollection.id,
        status: ProductStatus.PUBLISHED,
        categories: haldharCat ? [{ id: haldharCat.id }] : [],
        options: [{ title: "Weight", values: ["500g"] }],
        metadata: {
          rating: 4.9,
          reviews_count: 156,
          badge: "High Energy",
          ingredients: "Sattu, Jeera, Ajwain"
        },
        variants: [
          { title: "500g", sku: "HAL-SATTU-500G", prices: [{ amount: 190, currency_code: "inr" }], options: { Weight: "500g" } }
        ],
        sales_channels: [{ id: defaultSC.id }]
      },
      {
        title: "Haldhar Moong Multigrain Atta",
        handle: "haldhar-moong-multigrain-atta",
        subtitle: "Green Moong, Wheat & Barley Mix",
        description: "Special blend of 40% Green Moong, 40% Wheat, and 20% Barley. High in protein and fiber. Recommended for diabetes and cholesterol management.",
        thumbnail: "https://images.unsplash.com/photo-1515544832961-29243da5955f?auto=format&fit=crop&w=800&q=80",
        collection_id: haldharCollection.id,
        status: ProductStatus.PUBLISHED,
        categories: haldharCat ? [{ id: haldharCat.id }] : [],
        options: [{ title: "Weight", values: ["500g"] }],
        metadata: {
          rating: 4.8,
          reviews_count: 64,
          badge: "Immunity Boost",
          composition: "40% Green Moong, 40% Wheat, 20% Barley"
        },
        variants: [
          { title: "500g", sku: "HAL-MOONG-500G", prices: [{ amount: 220, currency_code: "inr" }], options: { Weight: "500g" } }
        ],
        sales_channels: [{ id: defaultSC.id }]
      },
      {
        title: "Haldhar Bajra Atta",
        handle: "haldhar-bajra-atta",
        subtitle: "Pearl Millet Flour | Gluten Free",
        description: "Rich in magnesium and potassium. Excellent for heart health and maintaining blood pressure. Ground in traditional stone chakki.",
        thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
        collection_id: haldharCollection.id,
        status: ProductStatus.PUBLISHED,
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
    ]

    const { result: createdProducts } = await createProductsWorkflow(container).run({
      input: { products: productsInput }
    })
    logger.info(`SUCCESS: Created ${createdProducts.length} Haldhar products!`)

  } catch (error) {
    logger.error(`Seed failed: ${error.message}`)
    console.error(error)
  }
}
