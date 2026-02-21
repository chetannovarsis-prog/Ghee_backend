"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = cleanupRegions;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function cleanupRegions({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const regionModule = container.resolve(utils_1.Modules.REGION);
    const fulfillmentModule = container.resolve(utils_1.Modules.FULFILLMENT);
    logger.info("Starting Cleanup: Removing Europe region and renaming fulfillment set...");
    try {
        // 1. Delete Europe region
        const [europeRegion] = await regionModule.listRegions({ name: "Europe" });
        if (europeRegion) {
            logger.info(`Deleting Europe region: ${europeRegion.id}`);
            await (0, core_flows_1.deleteRegionsWorkflow)(container).run({
                input: { ids: [europeRegion.id] }
            });
            logger.info("Europe region deleted successfully.");
        }
        else {
            logger.info("Europe region not found, skipping deletion.");
        }
        // 2. Rename Fulfillment Set
        const [fulfillmentSet] = await fulfillmentModule.listFulfillmentSets({
            name: "European Warehouse delivery",
        });
        if (fulfillmentSet) {
            logger.info(`Renaming fulfillment set: ${fulfillmentSet.id}`);
            await fulfillmentModule.updateFulfillmentSets({
                id: fulfillmentSet.id,
                name: "India Warehouse delivery"
            });
            logger.info("Fulfillment set renamed to 'India Warehouse delivery'.");
        }
        else {
            logger.info("Fulfillment set 'European Warehouse delivery' not found.");
        }
        logger.info("Cleanup COMPLETE!");
    }
    catch (err) {
        logger.error(`Error during cleanup: ${err.message}`);
        if (err.stack) {
            logger.error(err.stack);
        }
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xlYW51cC1yZWdpb25zLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvY2xlYW51cC1yZWdpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBS0EsaUNBMENDO0FBN0NELHFEQUE4RTtBQUM5RSw0REFBbUU7QUFFcEQsS0FBSyxVQUFVLGNBQWMsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUNsRSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2xFLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3RELE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7SUFFaEUsTUFBTSxDQUFDLElBQUksQ0FBQywwRUFBMEUsQ0FBQyxDQUFBO0lBRXZGLElBQUksQ0FBQztRQUNILDBCQUEwQjtRQUMxQixNQUFNLENBQUMsWUFBWSxDQUFDLEdBQUcsTUFBTSxZQUFZLENBQUMsV0FBVyxDQUFDLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxDQUFDLENBQUE7UUFDekUsSUFBSSxZQUFZLEVBQUUsQ0FBQztZQUNqQixNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixZQUFZLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUN6RCxNQUFNLElBQUEsa0NBQXFCLEVBQUMsU0FBUyxDQUFDLENBQUMsR0FBRyxDQUFDO2dCQUN6QyxLQUFLLEVBQUUsRUFBRSxHQUFHLEVBQUUsQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLEVBQUU7YUFDbEMsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFBO1FBQ3BELENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyw2Q0FBNkMsQ0FBQyxDQUFBO1FBQzVELENBQUM7UUFFRCw0QkFBNEI7UUFDNUIsTUFBTSxDQUFDLGNBQWMsQ0FBQyxHQUFHLE1BQU0saUJBQWlCLENBQUMsbUJBQW1CLENBQUM7WUFDbkUsSUFBSSxFQUFFLDZCQUE2QjtTQUNwQyxDQUFDLENBQUE7UUFDRixJQUFJLGNBQWMsRUFBRSxDQUFDO1lBQ25CLE1BQU0sQ0FBQyxJQUFJLENBQUMsNkJBQTZCLGNBQWMsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBQzdELE1BQU0saUJBQWlCLENBQUMscUJBQXFCLENBQUM7Z0JBQzVDLEVBQUUsRUFBRSxjQUFjLENBQUMsRUFBRTtnQkFDckIsSUFBSSxFQUFFLDBCQUEwQjthQUNqQyxDQUFDLENBQUE7WUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLHdEQUF3RCxDQUFDLENBQUE7UUFDdkUsQ0FBQzthQUFNLENBQUM7WUFDTixNQUFNLENBQUMsSUFBSSxDQUFDLDBEQUEwRCxDQUFDLENBQUE7UUFDekUsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQTtJQUNsQyxDQUFDO0lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUMseUJBQXlCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQ3BELElBQUksR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1lBQ1osTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7UUFDM0IsQ0FBQztJQUNILENBQUM7QUFDSCxDQUFDIn0=