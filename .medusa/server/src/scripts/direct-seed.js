"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = directSeed;
const utils_1 = require("@medusajs/framework/utils");
async function directSeed({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const productModule = container.resolve(utils_1.Modules.PRODUCT);
    const salesChannelModule = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const storeModule = container.resolve(utils_1.Modules.STORE);
    const regionModule = container.resolve(utils_1.Modules.REGION);
    logger.info("Starting Direct Seeding (v2 - Correct Methods)...");
    try {
        // 1. Setup INR
        const [store] = await storeModule.listStores();
        await storeModule.updateStores(store.id, {
            supported_currencies: [
                { currency_code: "inr", is_default: true }
            ]
        });
        logger.info("Store updated with INR");
        // 2. Setup Region
        const regions = await regionModule.listRegions({ name: "India" });
        let region = regions[0];
        if (!region) {
            region = await regionModule.createRegions({
                name: "India",
                currency_code: "inr",
                countries: ["in"]
            });
            logger.info("Region India created");
        }
        // 3. Setup Collection
        let collection = (await productModule.listProductCollections({ handle: "bilona-ghee" }))[0];
        if (!collection) {
            collection = await productModule.createProductCollections({
                title: "Bilona Ghee",
                handle: "bilona-ghee"
            });
            logger.info("Collection created");
        }
        // 4. Create Category
        let category = (await productModule.listProductCategories({ handle: "a2-ghee" }))[0];
        if (!category) {
            category = await productModule.createProductCategories({
                name: "A2 Ghee",
                handle: "a2-ghee",
                is_active: true
            });
            logger.info("Category created");
        }
        // 5. Create Product
        const p = await productModule.createProducts({
            title: "A2 Gir Cow Ghee - Dolchi",
            handle: "a2-gir-cow-ghee-dolchi",
            status: utils_1.ProductStatus.PUBLISHED,
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
        });
        logger.info(`Product created: ${p.id}`);
        // 6. Link to Sales Channel
        const [sc] = await salesChannelModule.listSalesChannels({ name: "Default Sales Channel" });
        if (sc) {
            const link = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
            await link.create({
                [utils_1.Modules.PRODUCT]: { product_id: p.id },
                [utils_1.Modules.SALES_CHANNEL]: { sales_channel_id: sc.id }
            });
            logger.info("Product linked to Sales Channel");
        }
        logger.info("DIRECT SEED SUCCESS!");
    }
    catch (err) {
        logger.error(`Direct seed failed: ${err.message}`);
        console.error(err);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlyZWN0LXNlZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9kaXJlY3Qtc2VlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDZCQXVGQztBQXpGRCxxREFBNkY7QUFFOUUsS0FBSyxVQUFVLFVBQVUsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUM5RCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2xFLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3hELE1BQU0sa0JBQWtCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7SUFDbkUsTUFBTSxXQUFXLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDcEQsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFdEQsTUFBTSxDQUFDLElBQUksQ0FBQyxtREFBbUQsQ0FBQyxDQUFBO0lBRWhFLElBQUksQ0FBQztRQUNILGVBQWU7UUFDZixNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsTUFBTSxXQUFXLENBQUMsVUFBVSxFQUFFLENBQUE7UUFDOUMsTUFBTSxXQUFXLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxFQUFFLEVBQUU7WUFDdkMsb0JBQW9CLEVBQUU7Z0JBQ3BCLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFO2FBQzNDO1NBQ0YsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFBO1FBRXJDLGtCQUFrQjtRQUNsQixNQUFNLE9BQU8sR0FBRyxNQUFNLFlBQVksQ0FBQyxXQUFXLENB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