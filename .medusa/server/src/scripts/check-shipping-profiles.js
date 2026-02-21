"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkShippingProfiles;
const utils_1 = require("@medusajs/framework/utils");
async function checkShippingProfiles({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Checking products with shipping profiles...");
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "shipping_profile"]
    });
    const productsWithShippingProfile = products.filter(p => p.shipping_profile);
    logger.info(`\nFound ${productsWithShippingProfile.length} products with shipping profiles:`);
    console.table(productsWithShippingProfile.map(p => ({
        title: p.title,
        shipping_profile: p.shipping_profile
    })));
    logger.info("\nChecking available shipping options...");
    const { data: shippingOptions } = await query.graph({
        entity: "shipping_option",
        fields: ["id", "name", "shipping_profile_id", "status"]
    });
    logger.info(`Found ${shippingOptions.length} shipping options`);
    console.table(shippingOptions.map(s => ({
        name: s.name,
        profile_id: s.shipping_profile_id,
        status: s.status
    })));
    if (shippingOptions.length === 0 && productsWithShippingProfile.length > 0) {
        logger.warn("\n⚠️  WARNING: Products have shipping profiles but NO shipping options are available!");
        logger.warn("This will cause cart completion to fail.");
        logger.info("\nTo fix this, either:");
        logger.info("1. Clear shipping_profile_id from all products, OR");
        logger.info("2. Create shipping methods in your backend");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stc2hpcHBpbmctcHJvZmlsZXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9jaGVjay1zaGlwcGluZy1wcm9maWxlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLHdDQXVDQztBQXpDRCxxREFBcUU7QUFFdEQsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ3pFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVoRSxNQUFNLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUE7SUFFMUQsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDM0MsTUFBTSxFQUFFLFNBQVM7UUFDakIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxrQkFBa0IsQ0FBQztLQUM1QyxDQUFDLENBQUE7SUFFRixNQUFNLDJCQUEyQixHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBRSxDQUFTLENBQUMsZ0JBQWdCLENBQUMsQ0FBQTtJQUVyRixNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsMkJBQTJCLENBQUMsTUFBTSxtQ0FBbUMsQ0FBQyxDQUFBO0lBQzdGLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUNsRCxLQUFLLEVBQUUsQ0FBQyxDQUFDLEtBQUs7UUFDZCxnQkFBZ0IsRUFBRyxDQUFTLENBQUMsZ0JBQWdCO0tBQzlDLENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFSixNQUFNLENBQUMsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLENBQUE7SUFDdkQsTUFBTSxFQUFFLElBQUksRUFBRSxlQUFlLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDbEQsTUFBTSxFQUFFLGlCQUFpQjtRQUN6QixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLHFCQUFxQixFQUFFLFFBQVEsQ0FBQztLQUN4RCxDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsZUFBZSxDQUFDLE1BQU0sbUJBQW1CLENBQUMsQ0FBQTtJQUMvRCxPQUFPLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSTtRQUNaLFVBQVUsRUFBRSxDQUFDLENBQUMsbUJBQW1CO1FBQ2pDLE1BQU0sRUFBRyxDQUFTLENBQUMsTUFBTTtLQUMxQixDQUFDLENBQUMsQ0FBQyxDQUFBO0lBRUosSUFBSSxlQUFlLENBQUMsTUFBTSxLQUFLLENBQUMsSUFBSSwyQkFBMkIsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDM0UsTUFBTSxDQUFDLElBQUksQ0FBQyx1RkFBdUYsQ0FBQyxDQUFBO1FBQ3BHLE1BQU0sQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQTtRQUN2RCxNQUFNLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUE7UUFDckMsTUFBTSxDQUFDLElBQUksQ0FBQyxvREFBb0QsQ0FBQyxDQUFBO1FBQ2pFLE1BQU0sQ0FBQyxJQUFJLENBQUMsNENBQTRDLENBQUMsQ0FBQTtJQUMzRCxDQUFDO0FBQ0gsQ0FBQyJ9