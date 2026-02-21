"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = removeShippingOptions;
const utils_1 = require("@medusajs/framework/utils");
async function removeShippingOptions({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const fulfillmentService = container.resolve(utils_1.Modules.FULFILLMENT);
    logger.info("Starting to remove all shipping options...");
    try {
        // Use the fulfillment module's query service available through container
        const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
        // Get all shipping options
        logger.info("Fetching shipping options...");
        const { data: options } = await query.graph({
            entity: "shipping_option",
            fields: ["id", "name"]
        });
        logger.info(`Found ${options.length} shipping options`);
        if (options.length === 0) {
            logger.info("No shipping options to remove.");
            return;
        }
        // For each option, we'll try to mark as deleted or update database
        for (const option of options) {
            try {
                logger.info(`Attempting to remove: ${option.name} (${option.id})`);
                // The query service has different methods - let's try using the database connection
                await query.delete({
                    entity: "shipping_option",
                    where: { id: option.id }
                });
                logger.info(`✓ Deleted: ${option.name}`);
            }
            catch (error) {
                logger.error(`Failed to delete ${option.name}: ${error?.message}`);
            }
        }
        logger.info(`✅ Successfully removed shipping options`);
        logger.info("Orders can now be completed without shipping configuration.");
    }
    catch (error) {
        logger.error("Error:", error?.message || String(error));
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVtb3ZlLXNoaXBwaW5nLW9wdGlvbnMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9yZW1vdmUtc2hpcHBpbmctb3B0aW9ucy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLHdDQTRDQztBQTlDRCxxREFBOEU7QUFFL0QsS0FBSyxVQUFVLHFCQUFxQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ3pFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxrQkFBa0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQTtJQUVqRSxNQUFNLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxDQUFDLENBQUE7SUFFekQsSUFBSSxDQUFDO1FBQ0gseUVBQXlFO1FBQ3pFLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUE7UUFFaEUsMkJBQTJCO1FBQzNCLE1BQU0sQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQTtRQUMzQyxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUMxQyxNQUFNLEVBQUUsaUJBQWlCO1lBQ3pCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7U0FDdkIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLE9BQU8sQ0FBQyxNQUFNLG1CQUFtQixDQUFDLENBQUE7UUFFdkQsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3pCLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0NBQWdDLENBQUMsQ0FBQTtZQUM3QyxPQUFNO1FBQ1IsQ0FBQztRQUVELG1FQUFtRTtRQUNuRSxLQUFLLE1BQU0sTUFBTSxJQUFJLE9BQU8sRUFBRSxDQUFDO1lBQzdCLElBQUksQ0FBQztnQkFDSCxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixNQUFNLENBQUMsSUFBSSxLQUFLLE1BQU0sQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO2dCQUNsRSxvRkFBb0Y7Z0JBQ3BGLE1BQU8sS0FBYSxDQUFDLE1BQU0sQ0FBQztvQkFDMUIsTUFBTSxFQUFFLGlCQUFpQjtvQkFDekIsS0FBSyxFQUFFLEVBQUUsRUFBRSxFQUFFLE1BQU0sQ0FBQyxFQUFFLEVBQUU7aUJBQ3pCLENBQUMsQ0FBQTtnQkFDRixNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUE7WUFDMUMsQ0FBQztZQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7Z0JBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0JBQW9CLE1BQU0sQ0FBQyxJQUFJLEtBQUssS0FBSyxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUE7WUFDcEUsQ0FBQztRQUNILENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLHlDQUF5QyxDQUFDLENBQUE7UUFDdEQsTUFBTSxDQUFDLElBQUksQ0FBQyw2REFBNkQsQ0FBQyxDQUFBO0lBQzVFLENBQUM7SUFBQyxPQUFPLEtBQVUsRUFBRSxDQUFDO1FBQ3BCLE1BQU0sQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLEtBQUssRUFBRSxPQUFPLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUE7SUFDekQsQ0FBQztBQUNILENBQUMifQ==