"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = linkRazorpayToIndia;
const utils_1 = require("@medusajs/framework/utils");
async function linkRazorpayToIndia({ container }) {
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    logger.info("Linking Razorpay to India region...");
    try {
        // 1. Get India region
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name"],
            filters: { name: "India" }
        });
        if (regions.length === 0) {
            logger.error("India region not found.");
            return;
        }
        const regionId = regions[0].id;
        // 2. Link region to razorpay provider
        // In Medusa v2, regions are linked to payment providers via a link
        // The link is usually Module.REGION -> Module.PAYMENT
        await remoteLink.create([
            {
                [utils_1.Modules.REGION]: {
                    region_id: regionId,
                },
                [utils_1.Modules.PAYMENT]: {
                    payment_provider_id: "pp_razorpay_razorpay",
                },
            },
        ]);
        logger.info(`Successfully linked pp_razorpay_razorpay to region: ${regions[0].name}`);
    }
    catch (err) {
        logger.error(`Error linking Razorpay: ${err.message}`);
        if (err.stack)
            logger.error(err.stack);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay1yYXpvcnBheS10by1pbmRpYS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2xpbmstcmF6b3JwYXktdG8taW5kaWEudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxzQ0EwQ0M7QUE1Q0QscURBQThFO0FBRS9ELEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxFQUFFLFNBQVMsRUFBRTtJQUMzRCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQzNFLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDaEUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVsRSxNQUFNLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUE7SUFFbEQsSUFBSSxDQUFDO1FBQ0Qsc0JBQXNCO1FBQ3RCLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3hDLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtTQUM3QixDQUFDLENBQUE7UUFFRixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1lBQ3ZDLE9BQU07UUFDVixDQUFDO1FBQ0QsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtRQUU5QixzQ0FBc0M7UUFDdEMsbUVBQW1FO1FBQ25FLHNEQUFzRDtRQUV0RCxNQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUM7WUFDcEI7Z0JBQ0ksQ0FBQyxlQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7b0JBQ2QsU0FBUyxFQUFFLFFBQVE7aUJBQ3RCO2dCQUNELENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO29CQUNmLG1CQUFtQixFQUFFLHNCQUFzQjtpQkFDOUM7YUFDSjtTQUNKLENBQUMsQ0FBQTtRQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsdURBQXVELE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFBO0lBRXpGLENBQUM7SUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO1FBQ1gsTUFBTSxDQUFDLEtBQUssQ0FBQywyQkFBMkIsR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7UUFDdEQsSUFBSSxHQUFHLENBQUMsS0FBSztZQUFFLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQzFDLENBQUM7QUFDTCxDQUFDIn0=