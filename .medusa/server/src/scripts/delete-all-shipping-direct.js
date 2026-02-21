"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = deleteAllShippingDirectly;
const utils_1 = require("@medusajs/framework/utils");
async function deleteAllShippingDirectly({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("=== DELETING ALL SHIPPING PROFILES AND OPTIONS ===\n");
    try {
        // Step 1: Get all shipping options
        logger.info("Step 1: Fetching all shipping options...");
        const { data: shippingOptions } = await query.graph({
            entity: "shipping_option",
            fields: ["id", "name"]
        });
        logger.info(`Found ${shippingOptions?.length || 0} shipping options`);
        shippingOptions?.forEach((opt) => {
            logger.info(`  - ${opt.name} (${opt.id})`);
        });
        // Step 2: Get all shipping profiles  
        logger.info("\nStep 2: Fetching all shipping profiles...");
        const { data: shippingProfiles } = await query.graph({
            entity: "shipping_profile",
            fields: ["id", "name", "type"]
        });
        logger.info(`Found ${shippingProfiles?.length || 0} shipping profiles`);
        shippingProfiles?.forEach((prof) => {
            logger.info(`  - ${prof.name} (type: ${prof.type}, id: ${prof.id})`);
        });
        logger.info("\n⚠️  Manual Deletion Required:");
        logger.info("=============================");
        logger.info("Unfortunately, the Medusa Query API doesn't provide delete methods.");
        logger.info("");
        logger.info("To delete shipping profiles without admin access, use SQL directly:");
        logger.info("");
        logger.info("If using SQLite (.db file):");
        logger.info("  1. Open your database file (usually storage.db)");
        logger.info("  2. Open in SQLite viewer or use command line:");
        logger.info("     sqlite3 storage.db");
        logger.info("  3. Run these SQL commands:");
        logger.info("     DELETE FROM shipping_option;");
        logger.info("     DELETE FROM shipping_profile;");
        logger.info("");
        logger.info("If using PostgreSQL/MySQL:");
        logger.info("  1. Connect to your database");
        logger.info("  2. Execute the same DELETE statements above");
        logger.info("");
        logger.info("Alternative: Clear the entire database and restart with fresh seed!");
    }
    catch (error) {
        logger.error("Error:", error?.message || String(error));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVsZXRlLWFsbC1zaGlwcGluZy1kaXJlY3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9kZWxldGUtYWxsLXNoaXBwaW5nLWRpcmVjdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLDRDQW9EQztBQXRERCxxREFBcUU7QUFFdEQsS0FBSyxVQUFVLHlCQUF5QixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQzdFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVoRSxNQUFNLENBQUMsSUFBSSxDQUFDLHNEQUFzRCxDQUFDLENBQUE7SUFFbkUsSUFBSSxDQUFDO1FBQ0gsbUNBQW1DO1FBQ25DLE1BQU0sQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQTtRQUN2RCxNQUFNLEVBQUUsSUFBSSxFQUFFLGVBQWUsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNsRCxNQUFNLEVBQUUsaUJBQWlCO1lBQ3pCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7U0FDdkIsQ0FBQyxDQUFBO1FBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLGVBQWUsRUFBRSxNQUFNLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxDQUFBO1FBQ3JFLGVBQWUsRUFBRSxPQUFPLENBQUMsQ0FBQyxHQUFRLEVBQUUsRUFBRTtZQUNwQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sR0FBRyxDQUFDLElBQUksS0FBSyxHQUFHLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtRQUM1QyxDQUFDLENBQUMsQ0FBQTtRQUVGLHNDQUFzQztRQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLDZDQUE2QyxDQUFDLENBQUE7UUFDMUQsTUFBTSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUNuRCxNQUFNLEVBQUUsa0JBQWtCO1lBQzFCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxDQUFDO1NBQy9CLENBQUMsQ0FBQTtRQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxnQkFBZ0IsRUFBRSxNQUFNLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxDQUFBO1FBQ3ZFLGdCQUFnQixFQUFFLE9BQU8sQ0FBQyxDQUFDLElBQVMsRUFBRSxFQUFFO1lBQ3RDLE1BQU0sQ0FBQyxJQUFJLENBQUMsT0FBTyxJQUFJLENBQUMsSUFBSSxXQUFXLElBQUksQ0FBQyxJQUFJLFNBQVMsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUE7UUFDdEUsQ0FBQyxDQUFDLENBQUE7UUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLGlDQUFpQyxDQUFDLENBQUE7UUFDOUMsTUFBTSxDQUFDLElBQUksQ0FBQywrQkFBK0IsQ0FBQyxDQUFBO1FBQzVDLE1BQU0sQ0FBQyxJQUFJLENBQUMscUVBQXFFLENBQUMsQ0FBQTtRQUNsRixNQUFNLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFBO1FBQ2YsTUFBTSxDQUFDLElBQUksQ0FBQyxxRUFBcUUsQ0FBQyxDQUFBO1FBQ2xGLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLDZCQUE2QixDQUFDLENBQUE7UUFDMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxtREFBbUQsQ0FBQyxDQUFBO1FBQ2hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsaURBQWlELENBQUMsQ0FBQTtRQUM5RCxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixDQUFDLENBQUE7UUFDdEMsTUFBTSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO1FBQzNDLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtRQUNoRCxNQUFNLENBQUMsSUFBSSxDQUFDLG9DQUFvQyxDQUFDLENBQUE7UUFDakQsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsNEJBQTRCLENBQUMsQ0FBQTtRQUN6QyxNQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixDQUFDLENBQUE7UUFDNUMsTUFBTSxDQUFDLElBQUksQ0FBQywrQ0FBK0MsQ0FBQyxDQUFBO1FBQzVELE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDZixNQUFNLENBQUMsSUFBSSxDQUFDLHFFQUFxRSxDQUFDLENBQUE7SUFFcEYsQ0FBQztJQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7UUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sSUFBSSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtJQUN6RCxDQUFDO0FBQ0gsQ0FBQyJ9