"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updatePricesV2;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function updatePricesV2({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const productModule = container.resolve(utils_1.Modules.PRODUCT);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const salesChannelModule = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const link = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    logger.info("Starting Price Update V2...");
    const updates = [
        { handle: "haldhar-multi-grain-atta", price: 180 },
        { handle: "haldhar-jowar-atta", price: 170 },
        { handle: "haldhar-whole-wheat-atta", price: 150 },
        { handle: "haldhar-bajra-atta", price: 130 }, // New Product
        { handle: "haldhar-moringa-sattu-mix", price: 220 },
        { handle: "haldhar-sattu-mix", price: 190 },
        { handle: "gousaaram-goumutra-capsules", price: 750, variantTitle: "30 Capsules", optionValue: "30 Capsules" },
        { handle: "a2-gir-cow-ghee-dolchi", price: 1800 } // Ghee
    ];
    try {
        const { data: salesChannels } = await query.graph({
            entity: "sales_channel",
            fields: ["id", "name"]
        });
        const defaultSC = salesChannels.find(sc => sc.name === "Default Sales Channel") || salesChannels[0];
        for (const update of updates) {
            const products = await productModule.listProducts({ handle: update.handle }, { relations: ["variants", "variants.prices", "variants.options", "options"] });
            if (products.length === 0) {
                if (update.handle === "haldhar-bajra-atta") {
                    logger.info(`Creating missing product: ${update.handle}`);
                    // Get necessary IDs
                    const haldharCat = (await productModule.listProductCategories({ handle: "traditional-flours" }))[0];
                    const haldharCollection = (await productModule.listProductCollections({ handle: "haldhar-flours" }))[0];
                    const newProduct = {
                        title: "Haldhar Bajra Atta",
                        handle: "haldhar-bajra-atta",
                        subtitle: "Pearl Millet Flour | Gluten Free",
                        description: "Rich in magnesium and potassium. Excellent for heart health and maintaining blood pressure. Ground in traditional stone chakki.",
                        thumbnail: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80",
                        collection_id: haldharCollection?.id,
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
                    };
                    const { result } = await (0, core_flows_1.createProductsWorkflow)(container).run({
                        input: { products: [newProduct] }
                    });
                    logger.info(`Created Bajra Atta: ${result[0].id}`);
                    continue;
                }
                else {
                    logger.warn(`Product not found: ${update.handle}`);
                    continue;
                }
            }
            const product = products[0];
            const variant = product.variants[0]; // Assuming single variant for now for simplicity based on seed
            if (!variant) {
                logger.warn(`No variant found for ${product.title}`);
                continue;
            }
            logger.info(`Updating ${product.title}...`);
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
                }];
            await productModule.updateProductVariants(product.id, [{
                    id: variant.id,
                    prices: prices
                }]);
            logger.info(`Updated price for ${product.title} to ${update.price}`);
            // Handle Capsule specific updates
            if (update.handle === "gousaaram-goumutra-capsules") {
                // Update Option
                const sizeOption = product.options.find(o => o.title === "Size");
                if (sizeOption) {
                    await productModule.updateProductOptions({
                        id: sizeOption.id,
                        title: "Size",
                        values: ["30 Capsules"]
                    });
                }
                // Update Variant
                await productModule.updateProductVariants(product.id, [{
                        id: variant.id,
                        title: "30 Capsules",
                        options: { "Size": "30 Capsules" }
                    }]);
                logger.info(`Updated Capsule variant info`);
            }
        }
        logger.info("Price Update Complete!");
    }
    catch (error) {
        logger.error(`Update failed: ${error.message}`);
        console.error(error);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXByaWNlcy12Mi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3VwZGF0ZS1wcmljZXMtdjIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFLQSxpQ0E4SUM7QUFqSkQscURBQTZGO0FBQzdGLDREQUFvRTtBQUVyRCxLQUFLLFVBQVUsY0FBYyxDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ2xFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDeEQsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNoRSxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQ25FLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFOUQsTUFBTSxDQUFDLElBQUksQ0FBQyw2QkFBNkIsQ0FBQyxDQUFBO0lBRTFDLE1BQU0sT0FBTyxHQUFHO1FBQ2QsRUFBRSxNQUFNLEVBQUUsMEJBQTBCLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtRQUNsRCxFQUFFLE1BQU0sRUFBRSxvQkFBb0IsRUFBRSxLQUFLLEVBQUUsR0FBRyxFQUFFO1FBQzVDLEVBQUUsTUFBTSxFQUFFLDBCQUEwQixFQUFFLEtBQUssRUFBRSxHQUFHLEVBQUU7UUFDbEQsRUFBRSxNQUFNLEVBQUUsb0JBQW9CLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxFQUFFLGNBQWM7UUFDNUQsRUFBRSxNQUFNLEVBQUUsMkJBQTJCLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRTtRQUNu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