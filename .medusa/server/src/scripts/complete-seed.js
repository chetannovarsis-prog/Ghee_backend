"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = completeSeed;
const utils_1 = require("@medusajs/framework/utils");
async function completeSeed({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const productModule = container.resolve(utils_1.Modules.PRODUCT);
    const salesChannelModule = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const link = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    logger.info("Completing Goushakti Seeding...");
    try {
        const [sc] = await salesChannelModule.listSalesChannels({ name: "Default Sales Channel" });
        const collection = (await productModule.listProductCollections({ handle: "bilona-ghee" }))[0];
        const a2GheeCat = (await productModule.listProductCategories({ handle: "a2-ghee" }))[0];
        const comboCat = (await productModule.listProductCategories({ handle: "healthy-combo" }))[0];
        const productsToSeed = [
            {
                title: "Bilona-Churned Desi Buffalo Ghee",
                handle: "bilona-churned-buffalo-ghee",
                status: utils_1.ProductStatus.PUBLISHED,
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
                status: utils_1.ProductStatus.PUBLISHED,
                collection_id: collection.id,
                thumbnail: "https://images.unsplash.com/photo-1541093113199-a2e93a238628?auto=format&fit=crop&w=800&q=80",
                options: [{ title: "Pack", values: ["Combo Pack"] }],
                variants: [
                    { title: "Combo Pack", sku: "COMBO-G", options: { Pack: "Combo Pack" }, prices: [{ amount: 16653, currency_code: "inr" }] }
                ]
            }
        ];
        for (const prodInput of productsToSeed) {
            const p = await productModule.createProducts(prodInput);
            logger.info(`Product created: ${p.title} (${p.id})`);
            if (sc) {
                await link.create({
                    [utils_1.Modules.PRODUCT]: { product_id: p.id },
                    [utils_1.Modules.SALES_CHANNEL]: { sales_channel_id: sc.id }
                });
            }
        }
        logger.info("SEEDING COMPLETE!");
    }
    catch (err) {
        logger.error(`Seed failed: ${err.message}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGxldGUtc2VlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2NvbXBsZXRlLXNlZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwrQkEwREM7QUE1REQscURBQTZGO0FBRTlFLEtBQUssVUFBVSxZQUFZLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDaEUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLGFBQWEsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUN4RCxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLGFBQWEsQ0FBQyxDQUFBO0lBQ25FLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsQ0FBQyxDQUFBO0lBRTlDLElBQUksQ0FBQztRQUNILE1BQU0sQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLGtCQUFrQixDQUFDLGlCQUFpQixDQUFDLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQTtRQUMxRixNQUFNLFVBQVUsR0FBRyxDQUFDLE1BQU0sYUFBYSxDQUFDLHNCQUFzQixDQUFDLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUM3RixNQUFNLFNBQVMsR0FBRyxDQUFDLE1BQU0sYUFBYSxDQUFDLHFCQUFxQixDQUFDLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUN2RixNQUFNLFFBQVEsR0FBRyxDQUFDLE1BQU0sYUFBYSxDQUFDLHFCQUFxQixDQUFDLEVBQUUs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