"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = debugCartPayments;
const utils_1 = require("@medusajs/framework/utils");
async function debugCartPayments({ container }) {
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const cartModule = container.resolve(utils_1.Modules.CART);
    const paymentModule = container.resolve(utils_1.Modules.PAYMENT);
    logger.info("Debugging Cart Payment Sessions...");
    try {
        // 1. Get India region
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name", "currency_code"],
            filters: { name: "India" }
        });
        if (regions.length === 0) {
            logger.error("India region not found.");
            return;
        }
        const region = regions[0];
        // 2. Create a temporary cart
        const cart = await cartModule.createCarts({
            region_id: region.id,
            currency_code: region.currency_code,
            items: []
        });
        logger.info(`Created test cart: ${cart.id}`);
        // 3. Check for payment providers from the store API perspective
        const { data: providers } = await query.graph({
            entity: "payment_provider",
            fields: ["id", "is_enabled"],
        });
        logger.info("All registered providers:");
        providers.forEach(p => logger.info(`- ${p.id} (Enabled: ${p.is_enabled})`));
        // 4. Try to list payment methods for this region (simulating storefront)
        // In V2, we check if they are linked
        const { data: regionProviders } = await query.graph({
            entity: "region",
            fields: ["payment_providers.*"],
            filters: { id: region.id }
        });
        logger.info(`Payment providers linked to India region (${region.id}):`);
        regionProviders[0].payment_providers.forEach(p => logger.info(`- ${p.id}`));
    }
    catch (err) {
        logger.error(`Error debugging cart payments: ${err.message}`);
        if (err.stack)
            logger.error(err.stack);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWctY2FydC1wYXltZW50cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2RlYnVnLWNhcnQtcGF5bWVudHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxvQ0FxREM7QUF2REQscURBQThFO0FBRS9ELEtBQUssVUFBVSxpQkFBaUIsQ0FBQyxFQUFFLFNBQVMsRUFBRTtJQUN6RCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2hFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDbEQsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFeEQsTUFBTSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO0lBRWpELElBQUksQ0FBQztRQUNELHNCQUFzQjtRQUN0QixNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN4QyxNQUFNLEVBQUUsUUFBUTtZQUNoQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQztZQUN2QyxPQUFPLEVBQUUsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFO1NBQzdCLENBQUMsQ0FBQTtRQUVGLElBQUksT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUUsQ0FBQztZQUN2QixNQUFNLENBQUMsS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUE7WUFDdkMsT0FBTTtRQUNWLENBQUM7UUFDRCxNQUFNLE1BQU0sR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFFekIsNkJBQTZCO1FBQzdCLE1BQU0sSUFBSSxHQUFHLE1BQU0sVUFBVSxDQUFDLFdBQVcsQ0FBQztZQUN0QyxTQUFTLEVBQUUsTUFBTSxDQUFDLEVBQUU7WUFDcEIsYUFBYSxFQUFFLE1BQU0sQ0FBQyxhQUFhO1lBQ25DLEtBQUssRUFBRSxFQUFFO1NBQ1osQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFFNUMsZ0VBQWdFO1FBQ2hFLE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQzFDLE1BQU0sRUFBRSxrQkFBa0I7WUFDMUIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLFlBQVksQ0FBQztTQUMvQixDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixDQUFDLENBQUE7UUFDeEMsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxjQUFjLENBQUMsQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUE7UUFFM0UseUVBQXlFO1FBQ3pFLHFDQUFxQztRQUNyQyxNQUFNLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNoRCxNQUFNLEVBQUUsUUFBUTtZQUNoQixNQUFNLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztZQUMvQixPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRTtTQUM3QixDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxNQUFNLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQTtRQUN2RSxlQUFlLENBQUMsQ0FBQyxDQUFDLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7SUFFL0UsQ0FBQztJQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLGtDQUFrQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUM3RCxJQUFJLEdBQUcsQ0FBQyxLQUFLO1lBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDMUMsQ0FBQztBQUNMLENBQUMifQ==