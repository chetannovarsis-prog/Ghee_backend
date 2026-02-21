"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = getRegionId;
const utils_1 = require("@medusajs/framework/utils");
async function getRegionId({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { data: regions } = await query.graph({
        entity: "region",
        fields: ["id", "name", "currency_code"],
        filters: {
            name: ["India"]
        }
    });
    if (regions.length > 0) {
        logger.info(`ID for India region: ${regions[0].id}`);
    }
    else {
        logger.error("India region not found");
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0LWluZGlhLWlkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvZ2V0LWluZGlhLWlkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0EsOEJBaUJDO0FBbkJELHFEQUFxRTtBQUV0RCxLQUFLLFVBQVUsV0FBVyxDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQy9ELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVoRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMxQyxNQUFNLEVBQUUsUUFBUTtRQUNoQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsQ0FBQztRQUN2QyxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsQ0FBQyxPQUFPLENBQUM7U0FDaEI7S0FDRixDQUFDLENBQUE7SUFFRixJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7UUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7SUFDdEQsQ0FBQztTQUFNLENBQUM7UUFDTixNQUFNLENBQUMsS0FBSyxDQUFDLHdCQUF3QixDQUFDLENBQUE7SUFDeEMsQ0FBQztBQUNILENBQUMifQ==