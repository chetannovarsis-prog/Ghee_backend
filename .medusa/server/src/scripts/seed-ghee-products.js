"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedGoushaktiProducts;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function seedGoushaktiProducts({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const storeModule = container.resolve(utils_1.Modules.STORE);
    logger.info("Starting Goushakti Ghee seeding (v4 - INR Support)...");
    try {
        // 1. Get Store and setup INR
        const [store] = await storeModule.listStores();
        logger.info(`Updating store ${store.id} with INR currency...`);
        await (0, core_flows_1.updateStoresWorkflow)(container).run({
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
        });
        // 2. Setup Region for India
        const { result: regions } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
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
        });
        const region = regions[0];
        logger.info(`Created region: ${region.name}`);
        // 3. Get Default Sales Channel
        const { data: salesChannels } = await query.graph({
            entity: "sales_channel",
            fields: ["id", "name"]
        });
        const defaultSC = salesChannels.find(sc => sc.name === "Default Sales Channel") || salesChannels[0];
        logger.info(`Using Sales Channel: ${defaultSC.name} (${defaultSC.id})`);
        // 4. Ensure Categories exist
        const { result: categories } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
            input: {
                product_categories: [
                    { name: "A2 Ghee", handle: "a2-ghee", is_active: true },
                    { name: "Healthy Combo", handle: "healthy-combo", is_active: true }
                ]
            }
        });
        const a2GheeCat = categories.find(c => c.handle === "a2-ghee");
        const comboCat = categories.find(c => c.handle === "healthy-combo");
        // 5. Ensure Collection exists
        const { result: collections } = await (0, core_flows_1.createCollectionsWorkflow)(container).run({
            input: {
                collections: [
                    { title: "Bilona Ghee", handle: "bilona-ghee" }
                ]
            }
        });
        const bilonaCollection = collections[0];
        // 6. Define Products
        const productsInput = [
            {
                title: "A2 Gir Cow Ghee - Dolchi",
                handle: "a2-gir-cow-ghee-dolchi",
                subtitle: "Traditional Bilona Churned",
                description: "Pure essence of Ayurvedic wellness from forest-grazed Gir cows.",
                thumbnail: "https://images.unsplash.com/photo-1589927986089-35812388d1f4?auto=format&fit=crop&w=800&q=80",
                collection_id: bilonaCollection.id,
                status: utils_1.ProductStatus.PUBLISHED,
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
                status: utils_1.ProductStatus.PUBLISHED,
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
                status: utils_1.ProductStatus.PUBLISHED,
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
        ];
        const { result: createdProducts } = await (0, core_flows_1.createProductsWorkflow)(container).run({
            input: { products: productsInput }
        });
        logger.info(`SUCCESS: Created ${createdProducts.length} Goushakti products!`);
    }
    catch (error) {
        logger.error(`Seed failed: ${error.message}`);
        console.error(error);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC1naGVlLXByb2R1Y3RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvc2VlZC1naGVlLXByb2R1Y3RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBV0Esd0NBbUxDO0FBN0xELHFEQUE2RjtBQUM3Riw0REFPb0M7QUFFckIsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ3pFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNoRSxNQUFNLFdBQVcsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVwRCxNQUFNLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUE7SUFFcEUsSUFBSSxDQUFDO1FBQ0gsNkJBQTZCO1FBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxNQUFNLFdBQVcsQ0FBQyxVQUFVLEVBQUUsQ0FBQTtRQUM5QyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixLQUFLLENBQUMsRUFBRSx1QkFBdUIsQ0FBQyxDQUFBO1FBRTlELE1BQU0sSUFBQSxpQ0FBb0IsRUFBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLENBQUM7WUFDeEMsS0FBSyxFQUFFO2dCQUNMLFFBQVEsRUFBRSxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsRUFBRSxFQUFFO2dCQUMxQixNQUFNLEVBQUU7b0JBQ04sb0JBQW9CLEVBQUU7d0JBQ3BCLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFO3dCQUMxQyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUU7d0JBQ3hCLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRTtxQkFD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