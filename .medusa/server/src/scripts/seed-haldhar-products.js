"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedHaldharProducts;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function seedHaldharProducts({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Starting Haldhar Traditional Products seeding...");
    try {
        // 1. Get Default Sales Channel
        const { data: salesChannels } = await query.graph({
            entity: "sales_channel",
            fields: ["id", "name"]
        });
        const defaultSC = salesChannels.find(sc => sc.name === "Default Sales Channel") || salesChannels[0];
        logger.info(`Using Sales Channel: ${defaultSC.name} (${defaultSC.id})`);
        // 2. Ensure Category exists
        const { result: categories } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
            input: {
                product_categories: [
                    { name: "Traditional Flours & Health", handle: "traditional-flours", is_active: true }
                ]
            }
        });
        const haldharCat = categories.find(c => c.handle === "traditional-flours");
        // 3. Ensure Collection exists
        const { result: collections } = await (0, core_flows_1.createCollectionsWorkflow)(container).run({
            input: {
                collections: [
                    { title: "Haldhar Traditional Flours", handle: "haldhar-flours" }
                ]
            }
        });
        const haldharCollection = collections[0];
        // 4. Define Products
        const productsInput = [
            {
                title: "Haldhar Jowar Atta",
                handle: "haldhar-jowar-atta",
                subtitle: "Natural Pre-Washed Grains | Bull Driven Chakki",
                description: "India's First Natural Pre-Washed Jowar Atta, ground in traditional bull-driven stone chakki to preserve nutrients. High in fiber, aids digestion and promotes gut health.",
                thumbnail: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80",
                collection_id: haldharCollection.id,
                status: utils_1.ProductStatus.PUBLISHED,
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
                status: utils_1.ProductStatus.PUBLISHED,
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
                status: utils_1.ProductStatus.PUBLISHED,
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
                status: utils_1.ProductStatus.PUBLISHED,
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
                status: utils_1.ProductStatus.PUBLISHED,
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
                status: utils_1.ProductStatus.PUBLISHED,
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
                status: utils_1.ProductStatus.PUBLISHED,
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
                status: utils_1.ProductStatus.PUBLISHED,
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
        ];
        const { result: createdProducts } = await (0, core_flows_1.createProductsWorkflow)(container).run({
            input: { products: productsInput }
        });
        logger.info(`SUCCESS: Created ${createdProducts.length} Haldhar products!`);
    }
    catch (error) {
        logger.error(`Seed failed: ${error.message}`);
        console.error(error);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC1oYWxkaGFyLXByb2R1Y3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvc2VlZC1oYWxkaGFyLXByb2R1Y3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBUUEsc0NBd05DO0FBL05ELHFEQUE2RjtBQUM3Riw0REFJb0M7QUFFckIsS0FBSyxVQUFVLG1CQUFtQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ3ZFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVoRSxNQUFNLENBQUMsSUFBSSxDQUFDLGtEQUFrRCxDQUFDLENBQUE7SUFFL0QsSUFBSSxDQUFDO1FBQ0gsK0JBQStCO1FBQy9CLE1BQU0sRUFBRSxJQUFJLEVBQUUsYUFBYSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ2hELE1BQU0sRUFBRSxlQUFlO1lBQ3ZCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7U0FDdkIsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxTQUFTLEdBQUcsYUFBYSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEtBQUssdUJBQXVCLENBQUMsSUFBSSxhQUFhLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDbkcsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsU0FBUyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUV2RSw0QkFBNEI7UUFDNUIsTUFBTSxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsR0FBRyxNQUFNLElBQUEsNENBQStCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO1lBQ2xGLEtBQUss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