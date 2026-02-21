"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clearStore;
const utils_1 = require("@medusajs/framework/utils");
/*
Note: Delete workflows are available but for a script like this,
we can also use the service directly if we are careful.
*/
async function clearStore({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const productModule = container.resolve(utils_1.Modules.PRODUCT);
    logger.info("Clearing store data...");
    const products = await productModule.listProducts({}, { select: ["id"] });
    if (products.length > 0) {
        await productModule.deleteProducts(products.map(p => p.id));
        logger.info(`Deleted ${products.length} products`);
    }
    const collections = await productModule.listProductCollections({}, { select: ["id"] });
    if (collections.length > 0) {
        await productModule.deleteProductCollections(collections.map(c => c.id));
        logger.info(`Deleted ${collections.length} collections`);
    }
    const categories = await productModule.listProductCategories({}, { select: ["id"] });
    if (categories.length > 0) {
        await productModule.deleteProductCategories(categories.map(c => c.id));
        logger.info(`Deleted ${categories.length} categories`);
    }
    logger.info("Store cleared successfully.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYXItc3RvcmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9jbGVhci1zdG9yZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9BLDZCQXlCQztBQS9CRCxxREFBOEU7QUFDOUU7OztFQUdFO0FBRWEsS0FBSyxVQUFVLFVBQVUsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUM5RCxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2xFLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRXhELE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLENBQUMsQ0FBQTtJQUVyQyxNQUFNLFFBQVEsR0FBRyxNQUFNLGFBQWEsQ0FBQyxZQUFZLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3pFLElBQUksUUFBUSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUN4QixNQUFNLGFBQWEsQ0FBQyxjQUFjLENBQUMsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFBO1FBQzNELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxRQUFRLENBQUMsTUFBTSxXQUFXLENBQUMsQ0FBQTtJQUNwRCxDQUFDO0lBRUQsTUFBTSxXQUFXLEdBQUcsTUFBTSxhQUFhLENBQUMsc0JBQXNCLENBQUMsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ3RGLElBQUksV0FBVyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQztRQUMzQixNQUFNLGFBQWEsQ0FBQyx3QkFBd0IsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUE7UUFDeEUsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLFdBQVcsQ0FBQyxNQUFNLGNBQWMsQ0FBQyxDQUFBO0lBQzFELENBQUM7SUFFRCxNQUFNLFVBQVUsR0FBRyxNQUFNLGFBQWEsQ0FBQyxxQkFBcUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDcEYsSUFBSSxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQzFCLE1BQU0sYUFBYSxDQUFDLHVCQUF1QixDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUN0RSxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsVUFBVSxDQUFDLE1BQU0sYUFBYSxDQUFDLENBQUE7SUFDeEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsNkJBQTZCLENBQUMsQ0FBQTtBQUM1QyxDQUFDIn0=