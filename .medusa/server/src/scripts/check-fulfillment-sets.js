"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkFulfillmentSets;
const utils_1 = require("@medusajs/framework/utils");
async function checkFulfillmentSets({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const fulfillmentModule = container.resolve(utils_1.Modules.FULFILLMENT);
    const sets = await fulfillmentModule.listFulfillmentSets({}, { relations: ["service_zones", "service_zones.geo_zones"] });
    logger.info(`Found ${sets.length} fulfillment sets:`);
    console.log(JSON.stringify(sets, null, 2));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stZnVsZmlsbG1lbnQtc2V0cy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2NoZWNrLWZ1bGZpbGxtZW50LXNldHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSx1Q0FRQztBQVZELHFEQUE4RTtBQUUvRCxLQUFLLFVBQVUsb0JBQW9CLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDeEUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBRWhFLE1BQU0sSUFBSSxHQUFHLE1BQU0saUJBQWlCLENBQUMsbUJBQW1CLENBQUMsRUFBRSxFQUFFLEVBQUUsU0FBUyxFQUFFLENBQUMsZUFBZSxFQUFFLHlCQUF5QixDQUFDLEVBQUUsQ0FBQyxDQUFBO0lBRXpILE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxJQUFJLENBQUMsTUFBTSxvQkFBb0IsQ0FBQyxDQUFBO0lBQ3JELE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUMsQ0FBQyJ9