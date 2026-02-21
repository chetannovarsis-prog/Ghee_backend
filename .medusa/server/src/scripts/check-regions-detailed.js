"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkRegionsDetailed;
const utils_1 = require("@medusajs/framework/utils");
async function checkRegionsDetailed({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { data: regions } = await query.graph({
        entity: "region",
        fields: ["id", "name", "currency_code", "countries.iso_2"]
    });
    logger.info(`Found ${regions.length} regions:`);
    console.table(regions.map(r => ({
        name: r.name,
        currency: r.currency_code,
        countries: r.countries?.map(c => c.iso_2).join(", ")
    })));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stcmVnaW9ucy1kZXRhaWxlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2NoZWNrLXJlZ2lvbnMtZGV0YWlsZWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSx1Q0FlQztBQWpCRCxxREFBcUU7QUFFdEQsS0FBSyxVQUFVLG9CQUFvQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ3hFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVoRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMxQyxNQUFNLEVBQUUsUUFBUTtRQUNoQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLGVBQWUsRUFBRSxpQkFBaUIsQ0FBQztLQUMzRCxDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsT0FBTyxDQUFDLE1BQU0sV0FBVyxDQUFDLENBQUE7SUFDL0MsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQztRQUM5QixJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUk7UUFDWixRQUFRLEVBQUUsQ0FBQyxDQUFDLGFBQWE7UUFDekIsU0FBUyxFQUFFLENBQUMsQ0FBQyxTQUFTLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBRSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7S0FDdEQsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNOLENBQUMifQ==