"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkShipping;
const utils_1 = require("@medusajs/framework/utils");
async function checkShipping({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const fulfillmentModule = container.resolve(utils_1.Modules.FULFILLMENT);
    const profiles = await fulfillmentModule.listShippingProfiles();
    logger.info(`Found ${profiles.length} shipping profiles:`);
    console.log(JSON.stringify(profiles, null, 2));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stc2hpcHBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9jaGVjay1zaGlwcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUlBLGdDQU9DO0FBVEQscURBQThFO0FBRS9ELEtBQUssVUFBVSxhQUFhLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDakUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLGlCQUFpQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBRWhFLE1BQU0sUUFBUSxHQUFHLE1BQU0saUJBQWlCLENBQUMsb0JBQW9CLEVBQUUsQ0FBQTtJQUMvRCxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsUUFBUSxDQUFDLE1BQU0scUJBQXFCLENBQUMsQ0FBQTtJQUMxRCxPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsUUFBUSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQ2hELENBQUMifQ==