"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = listLinks;
const utils_1 = require("@medusajs/framework/utils");
async function listLinks({ container }) {
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    logger.info("Listing links between Region and Payment Provider...");
    try {
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name", "payment_providers.*"],
        });
        regions.forEach(region => {
            logger.info(`Region: ${region.name} (${region.id})`);
            if (region.payment_providers) {
                region.payment_providers.forEach(p => {
                    logger.info(`  - Linked Provider: ${p.id}`);
                });
            }
            else {
                logger.info("  - No linked providers found.");
            }
        });
    }
    catch (err) {
        logger.error(`Error listing links: ${err.message}`);
        if (err.stack)
            logger.error(err.stack);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlzdC1saW5rcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2xpc3QtbGlua3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSw0QkEyQkM7QUE3QkQscURBQThFO0FBRS9ELEtBQUssVUFBVSxTQUFTLENBQUMsRUFBRSxTQUFTLEVBQUU7SUFDakQsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNoRSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRWxFLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0RBQXNELENBQUMsQ0FBQTtJQUVuRSxJQUFJLENBQUM7UUFDRCxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN4QyxNQUFNLEVBQUUsUUFBUTtZQUNoQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLHFCQUFxQixDQUFDO1NBQ2hELENBQUMsQ0FBQTtRQUVGLE9BQU8sQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7WUFDckIsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLE1BQU0sQ0FBQyxJQUFJLEtBQUssTUFBTSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7WUFDcEQsSUFBSSxNQUFNLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztnQkFDM0IsTUFBTSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtvQkFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7Z0JBQy9DLENBQUMsQ0FBQyxDQUFBO1lBQ04sQ0FBQztpQkFBTSxDQUFDO2dCQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtZQUNqRCxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUE7SUFFTixDQUFDO0lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsd0JBQXdCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQ25ELElBQUksR0FBRyxDQUFDLEtBQUs7WUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUMxQyxDQUFDO0FBQ0wsQ0FBQyJ9