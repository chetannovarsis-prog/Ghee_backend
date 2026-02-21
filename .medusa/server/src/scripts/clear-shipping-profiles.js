"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = clearShippingProfiles;
const utils_1 = require("@medusajs/framework/utils");
async function clearShippingProfiles({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Checking products and shipping options...");
    // Check if there are any shipping methods
    const { data: shippingOptions } = await query.graph({
        entity: "shipping_option",
        fields: ["id", "name"]
    });
    if (shippingOptions.length > 0) {
        logger.info(`Found ${shippingOptions.length} shipping options. No changes needed.`);
        return;
    }
    logger.info("No shipping options found. Clearing shipping_profile_id from all products...");
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "shipping_profile"]
    });
    const productsWithShipping = products.filter(p => p.shipping_profile);
    logger.info(`Clearing shipping profile from ${productsWithShipping.length} products...`);
    try {
        // Update each product to remove shipping_profile_id
        for (const product of productsWithShipping) {
            await query.update({
                entity: "product",
                where: { id: product.id },
                data: { shipping_profile: null }
            });
            logger.info(`✓ Cleared shipping profile from: ${product.title}`);
        }
        logger.info(`\n✅ Successfully cleared shipping profiles from ${productsWithShipping.length} products`);
        logger.info("Orders can now be completed without shipping methods configured.");
    }
    catch (error) {
        logger.error("Failed to clear shipping profiles:", error);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYXItc2hpcHBpbmctcHJvZmlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9jbGVhci1zaGlwcGluZy1wcm9maWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLHdDQTRDQztBQTlDRCxxREFBcUU7QUFFdEQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ3pFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVoRSxNQUFNLENBQUMsSUFBSSxDQUFDLDJDQUEyQyxDQUFDLENBQUE7SUFFeEQsMENBQTBDO0lBQzFDLE1BQU0sRUFBRSxJQUFJLEVBQUUsZUFBZSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQ2xELE1BQU0sRUFBRSxpQkFBaUI7UUFDekIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztLQUN2QixDQUFDLENBQUE7SUFFRixJQUFJLGVBQWUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDL0IsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLGVBQWUsQ0FBQyxNQUFNLHVDQUF1QyxDQUFDLENBQUE7UUFDbkYsT0FBTTtJQUNSLENBQUM7SUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLDhFQUE4RSxDQUFDLENBQUE7SUFFM0YsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDM0MsTUFBTSxFQUFFLFNBQVM7UUFDakIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQztLQUM1QyxDQUFDLENBQUE7SUFFRixNQUFNLG9CQUFvQixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtJQUU5RSxNQUFNLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxvQkFBb0IsQ0FBQyxNQUFNLGNBQWMsQ0FBQyxDQUFBO0lBRXhGLElBQUksQ0FBQztRQUNILG9EQUFvRDtRQUNwRCxLQUFLLE1BQU0sT0FBTyxJQUFJLG9CQUFvQixFQUFFLENBQUM7WUFDM0MsTUFBTyxLQUFhLENBQUMsTUFBTSxDQUFDO2dCQUMxQixNQUFNLEVBQUUsU0FBUztnQkFDakIsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFLEVBQUU7Z0JBQ3pCLElBQUksRUFBRSxFQUFFLGdCQUFnQixFQUFFLElBQUksRUFBRTthQUNqQyxDQUFDLENBQUE7WUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxPQUFPLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQTtRQUNsRSxDQUFDO1FBRUQsTUFBTSxDQUFDLElBQUksQ0FBQyxtREFBbUQsb0JBQW9CLENBQUMsTUFBTSxXQUFXLENBQUMsQ0FBQTtRQUN0RyxNQUFNLENBQUMsSUFBSSxDQUFDLGtFQUFrRSxDQUFDLENBQUE7SUFDakYsQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixNQUFNLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxFQUFFLEtBQUssQ0FBQyxDQUFBO0lBQzNELENBQUM7QUFDSCxDQUFDIn0=