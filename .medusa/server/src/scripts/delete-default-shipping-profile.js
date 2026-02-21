"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deleteDefaultShippingProfile;
const utils_1 = require("@medusajs/framework/utils");
async function deleteDefaultShippingProfile({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    logger.info("Attempting to delete default shipping profile and options...");
    logger.info("NOTE: This script has limited ability to delete due to Medusa API constraints.");
    logger.info("");
    logger.info("MANUAL FIX REQUIRED:");
    logger.info("===================");
    logger.info("1. Go to your Medusa Admin Panel");
    logger.info("2. Navigate to Settings > Shipping Profiles");
    logger.info("3. Delete the 'Default Shipping Profile'");
    logger.info("4. Delete all Shipping Options under Settings > Shipping");
    logger.info("");
    logger.info("After doing this manually, orders will be able to complete without shipping.");
    logger.info("");
    logger.info("Once deleted, restart your backend and frontend servers and try checkout again.");
    try {
        const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
        // Get the default profile info
        const { data: profiles } = await query.graph({
            entity: "shipping_profile",
            fields: ["id", "name", "type"]
        });
        logger.info(`Current shipping profiles: ${profiles.length}`);
        profiles.forEach(p => {
            logger.info(`  - ${p.name} (type: ${p.type})`);
        });
    }
    catch (error) {
        logger.error("Error:", error?.message);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLWRlZmF1bHQtc2hpcHBpbmctcHJvZmlsZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2RlbGV0ZS1kZWZhdWx0LXNoaXBwaW5nLXByb2ZpbGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSwrQ0FrQ0M7QUFwQ0QscURBQXFFO0FBRXRELEtBQUssVUFBVSw0QkFBNEIsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUNoRixNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBRWxFLE1BQU0sQ0FBQyxJQUFJLENBQUMsOERBQThELENBQUMsQ0FBQTtJQUMzRSxNQUFNLENBQUMsSUFBSSxDQUFDLGdGQUFnRixDQUFDLENBQUE7SUFDN0YsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtJQUNuQyxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUE7SUFDbEMsTUFBTSxDQUFDLElBQUksQ0FBQyxrQ0FBa0MsQ0FBQyxDQUFBO0lBQy9DLE1BQU0sQ0FBQyxJQUFJLENBQUMsNkNBQTZDLENBQUMsQ0FBQTtJQUMxRCxNQUFNLENBQUMsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLENBQUE7SUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQywwREFBMEQsQ0FBQyxDQUFBO0lBQ3ZFLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLDhFQUE4RSxDQUFDLENBQUE7SUFDM0YsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtJQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsaUZBQWlGLENBQUMsQ0FBQTtJQUU5RixJQUFJLENBQUM7UUFDSCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFBO1FBRWhFLCtCQUErQjtRQUMvQixNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUMzQyxNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO1NBQy9CLENBQUMsQ0FBQTtRQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsOEJBQThCLFFBQVEsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFBO1FBQzVELFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7WUFDbkIsTUFBTSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLElBQUksR0FBRyxDQUFDLENBQUE7UUFDaEQsQ0FBQyxDQUFDLENBQUE7SUFFSixDQUFDO0lBQUMsT0FBTyxLQUFVLEVBQUUsQ0FBQztRQUNwQixNQUFNLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxLQUFLLEVBQUUsT0FBTyxDQUFDLENBQUE7SUFDeEMsQ0FBQztBQUNILENBQUMifQ==