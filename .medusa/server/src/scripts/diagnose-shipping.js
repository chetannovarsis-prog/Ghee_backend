"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = diagnoseShippingIssue;
const utils_1 = require("@medusajs/framework/utils");
async function diagnoseShippingIssue({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("=== SHIPPING DIAGNOSIS ===\n");
    try {
        // Check products with variants
        logger.info("1. Checking PRODUCTS WITH VARIANTS...");
        const { data: products } = await query.graph({
            entity: "product",
            fields: ["id", "title", "shipping_profile", "variants.id", "variants.title", "variants.shipping_profile"]
        });
        logger.info(`Found ${products.length} total products`);
        products.forEach(p => {
            logger.info(`  Product: ${p.title} (product profile: ${p.shipping_profile || "null"})`);
            if (p.variants && p.variants.length > 0) {
                p.variants.forEach(v => {
                    logger.info(`    - Variant: ${v.title} (variant profile: ${v.shipping_profile || "null"})`);
                });
            }
        });
        // Check shipping profiles
        logger.info("\n2. Checking SHIPPING PROFILES...");
        const { data: profiles } = await query.graph({
            entity: "shipping_profile",
            fields: ["id", "name", "type"]
        });
        logger.info(`Found ${profiles.length} shipping profiles`);
        profiles.forEach(p => {
            logger.info(`  - ${p.name} (id: ${p.id}, type: ${p.type})`);
        });
        // Check shipping options
        logger.info("\n3. Checking SHIPPING OPTIONS...");
        const { data: options } = await query.graph({
            entity: "shipping_option",
            fields: ["id", "name", "shipping_profile", "region_id"]
        });
        logger.info(`Found ${options.length} shipping options`);
        options.forEach(o => {
            logger.info(`  - ${o.name} (id: ${o.id}, profile: ${o.shipping_profile})`);
        });
        logger.info("\n=== DIAGNOSIS COMPLETE ===");
    }
    catch (error) {
        logger.error("Error during diagnosis:", error?.message || String(error));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlhZ25vc2Utc2hpcHBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9kaWFnbm9zZS1zaGlwcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLHdDQXFEQztBQXZERCxxREFBcUU7QUFFdEQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ3pFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVoRSxNQUFNLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUE7SUFFM0MsSUFBSSxDQUFDO1FBQ0gsK0JBQStCO1FBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUNBQXVDLENBQUMsQ0FBQTtRQUNwRCxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUMzQyxNQUFNLEVBQUUsU0FBUztZQUNqQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLGtCQUFrQixFQUFFLGFBQWEsRUFBRSxnQkFBZ0IsRUFBRSwyQkFBMkIsQ0FBQztTQUMxRyxDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsUUFBUSxDQUFDLE1BQU0saUJBQWlCLENBQUMsQ0FBQTtRQUN0RCxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUMsS0FBSyxzQkFBdUIsQ0FBUyxDQUFDLGdCQUFnQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUE7WUFDaEcsSUFBSSxDQUFDLENBQUMsUUFBUSxJQUFJLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO2dCQUN4QyxDQUFDLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLEtBQUssc0JBQXVCLENBQVMsQ0FBQyxnQkFBZ0IsSUFBSSxNQUFNLEdBQUcsQ0FBQyxDQUFBO2dCQUN0RyxDQUFDLENBQUMsQ0FBQTtZQUNKLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQTtRQUVGLDBCQUEwQjtRQUMxQixNQUFNLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUE7UUFDakQsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDM0MsTUFBTSxFQUFFLGtCQUFrQjtZQUMxQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLE1BQU0sQ0FBQztTQUMvQixDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsUUFBUSxDQUFDLE1BQU0sb0JBQW9CLENBQUMsQ0FBQTtRQUN6RCxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxTQUFTLENBQUMsQ0FBQyxFQUFFLFdBQVcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUE7UUFDN0QsQ0FBQyxDQUFDLENBQUE7UUFFRix5QkFBeUI7UUFDekIsTUFBTSxDQUFDLElBQUksQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFBO1FBQ2hELE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQzFDLE1BQU0sRUFBRSxpQkFBaUI7WUFDekIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxXQUFXLENBQUM7U0FDeEQsQ0FBQyxDQUFBO1FBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLE9BQU8sQ0FBQyxNQUFNLG1CQUFtQixDQUFDLENBQUE7UUFDdkQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksU0FBUyxDQUFDLENBQUMsRUFBRSxjQUFlLENBQVMsQ0FBQyxnQkFBZ0IsR0FBRyxDQUFDLENBQUE7UUFDckYsQ0FBQyxDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUE7SUFFN0MsQ0FBQztJQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7UUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLEVBQUUsT0FBTyxJQUFJLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFBO0lBQzFFLENBQUM7QUFDSCxDQUFDIn0=