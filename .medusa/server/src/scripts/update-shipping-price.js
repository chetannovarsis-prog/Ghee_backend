"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateShippingPrice;
const utils_1 = require("@medusajs/framework/utils");
async function updateShippingPrice({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const fulfillmentModuleService = container.resolve(utils_1.Modules.FULFILLMENT);
    const pricingModuleService = container.resolve(utils_1.Modules.PRICING);
    // Get all shipping options
    const shippingOptions = await fulfillmentModuleService.listShippingOptions();
    logger.info(`Found ${shippingOptions.length} shipping options:`);
    shippingOptions.forEach((opt) => logger.info(`  - ${opt.name} (${opt.id})`));
    // Get associated price sets
    const { data: shippingOptionPriceSets } = await container
        .resolve(utils_1.ContainerRegistrationKeys.QUERY)
        .graph({
        entity: "shipping_option",
        fields: ["id", "name", "prices.*", "prices.id", "prices.amount", "prices.currency_code"],
    });
    logger.info("Shipping option prices:");
    for (const opt of shippingOptionPriceSets) {
        logger.info(`  ${opt.name}: ${JSON.stringify(opt.prices?.map((p) => ({ amount: p.amount, currency: p.currency_code })))}`);
    }
    // Update all shipping option prices to 0
    for (const opt of shippingOptionPriceSets) {
        if (opt.prices?.length > 0) {
            for (const price of opt.prices) {
                try {
                    await pricingModuleService.updatePriceSets(price.id, {
                        prices: [
                            {
                                id: price.id,
                                amount: 0,
                            },
                        ]
                    });
                    logger.info(`✅ Updated price ${price.id} (${price.currency_code}) to 0`);
                }
                catch (e) {
                    logger.error(`Failed to update price ${price.id}: ${e.message}`);
                }
            }
        }
    }
    logger.info("Done! All shipping prices updated to ₹0 (Free Shipping)");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBkYXRlLXNoaXBwaW5nLXByaWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvdXBkYXRlLXNoaXBwaW5nLXByaWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esc0NBNkNDO0FBL0NELHFEQUE4RTtBQUUvRCxLQUFLLFVBQVUsbUJBQW1CLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDckUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLHdCQUF3QixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQ3ZFLE1BQU0sb0JBQW9CLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7SUFFL0QsMkJBQTJCO0lBQzNCLE1BQU0sZUFBZSxHQUFHLE1BQU0sd0JBQXdCLENBQUMsbUJBQW1CLEVBQUUsQ0FBQTtJQUM1RSxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsZUFBZSxDQUFDLE1BQU0sb0JBQW9CLENBQUMsQ0FBQTtJQUNoRSxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUMsR0FBUSxFQUFFLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBO0lBRWpGLDRCQUE0QjtJQUM1QixNQUFNLEVBQUUsSUFBSSxFQUFFLHVCQUF1QixFQUFFLEdBQUcsTUFBTSxTQUFTO1NBQ3BELE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUM7U0FDeEMsS0FBSyxDQUFDO1FBQ0gsTUFBTSxFQUFFLGlCQUFpQjtRQUN6QixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsZUFBZSxFQUFFLHNCQUFzQixDQUFDO0tBQzNGLENBQUMsQ0FBQTtJQUVOLE1BQU0sQ0FBQyxJQUFJLENBQUMseUJBQXlCLENBQUMsQ0FBQTtJQUN0QyxLQUFLLE1BQU0sR0FBRyxJQUFJLHVCQUFnQyxFQUFFLENBQUM7UUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBQ25JLENBQUM7SUFFRCx5Q0FBeUM7SUFDekMsS0FBSyxNQUFNLEdBQUcsSUFBSSx1QkFBZ0MsRUFBRSxDQUFDO1FBQ2pELElBQUksR0FBRyxDQUFDLE1BQU0sRUFBRSxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDekIsS0FBSyxNQUFNLEtBQUssSUFBSSxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUM7Z0JBQzdCLElBQUksQ0FBQztvQkFDRCxNQUFPLG9CQUE0QixDQUFDLGVBQWUsQ0FBQyxLQUFLLENBQUMsRUFBRSxFQUFFO3dCQUMxRCxNQUFNLEVBQUU7NEJBQ0o7Z0NBQ0ksRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFO2dDQUNaLE1BQU0sRUFBRSxDQUFDOzZCQUNaO3lCQUNKO3FCQUNKLENBQUMsQ0FBQTtvQkFDRixNQUFNLENBQUMsSUFBSSxDQUFDLG1CQUFtQixLQUFLLENBQUMsRUFBRSxLQUFLLEtBQUssQ0FBQyxhQUFhLFFBQVEsQ0FBQyxDQUFBO2dCQUM1RSxDQUFDO2dCQUFDLE9BQU8sQ0FBTSxFQUFFLENBQUM7b0JBQ2QsTUFBTSxDQUFDLEtBQUssQ0FBQywwQkFBMEIsS0FBSyxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtnQkFDcEUsQ0FBQztZQUNMLENBQUM7UUFDTCxDQUFDO0lBQ0wsQ0FBQztJQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMseURBQXlELENBQUMsQ0FBQTtBQUMxRSxDQUFDIn0=