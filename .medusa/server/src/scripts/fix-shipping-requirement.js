"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = removeShippingFromProducts;
const utils_1 = require("@medusajs/framework/utils");
async function removeShippingFromProducts({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Starting to remove shipping profiles from all products...");
    try {
        // Get all products with shipping profiles
        logger.info("Fetching products with shipping profiles...");
        const { data: products } = await query.graph({
            entity: "product",
            fields: ["id", "title", "shipping_profile"]
        });
        const productsWithShipping = products.filter(p => p.shipping_profile);
        logger.info(`Found ${productsWithShipping.length} products with shipping profiles`);
        if (productsWithShipping.length === 0) {
            logger.info("No products have shipping profiles. Nothing to update.");
            return;
        }
        // Update products using the query service
        logger.info("Updating products to remove shipping profiles...");
        for (const product of productsWithShipping) {
            await query.update({
                entity: "product",
                where: { id: product.id },
                data: { shipping_profile: null }
            });
            logger.info(`✓ Updated: ${product.title}`);
        }
        logger.info(`✅ Successfully cleared shipping_profile_id from ${productsWithShipping.length} products`);
        logger.info("Orders can now be completed without shipping method configuration.");
    }
    catch (error) {
        logger.error("Error:", error?.message || String(error));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4LXNoaXBwaW5nLXJlcXVpcmVtZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvZml4LXNoaXBwaW5nLXJlcXVpcmVtZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsNkNBdUNDO0FBekNELHFEQUFxRTtBQUV0RCxLQUFLLFVBQVUsMEJBQTBCLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDOUUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRWhFLE1BQU0sQ0FBQyxJQUFJLENBQUMsMkRBQTJELENBQUMsQ0FBQTtJQUV4RSxJQUFJLENBQUM7UUFDSCwwQ0FBMEM7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFBO1FBQzFELE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQzNDLE1BQU0sRUFBRSxTQUFTO1lBQ2pCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsa0JBQWtCLENBQUM7U0FDNUMsQ0FBQyxDQUFBO1FBRUYsTUFBTSxvQkFBb0IsR0FBRyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUUsQ0FBUyxDQUFDLGdCQUFnQixDQUFDLENBQUE7UUFDOUUsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLG9CQUFvQixDQUFDLE1BQU0sa0NBQWtDLENBQUMsQ0FBQTtRQUVuRixJQUFJLG9CQUFvQixDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLHdEQUF3RCxDQUFDLENBQUE7WUFDckUsT0FBTTtRQUNSLENBQUM7UUFFRCwwQ0FBMEM7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxrREFBa0QsQ0FBQyxDQUFBO1FBRS9ELEtBQUssTUFBTSxPQUFPLElBQUksb0JBQW9CLEVBQUUsQ0FBQztZQUMzQyxNQUFPLEtBQWEsQ0FBQyxNQUFNLENBQUM7Z0JBQzFCLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRTtnQkFDekIsSUFBSSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFO2FBQ2pDLENBQUMsQ0FBQTtZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtRQUM1QyxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxtREFBbUQsb0JBQW9CLENBQUMsTUFBTSxXQUFXLENBQUMsQ0FBQTtRQUN0RyxNQUFNLENBQUMsSUFBSSxDQUFDLG9FQUFvRSxDQUFDLENBQUE7SUFDbkYsQ0FBQztJQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7UUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0FBQ0gsQ0FBQyJ9