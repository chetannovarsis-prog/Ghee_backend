"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkSalesChannels;
const utils_1 = require("@medusajs/framework/utils");
async function checkSalesChannels({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { data: salesChannels } = await query.graph({
        entity: "sales_channel",
        fields: ["id", "name", "description"]
    });
    logger.info(`Found ${salesChannels.length} sales channels:`);
    console.table(salesChannels);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stc2FsZXMtY2hhbm5lbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9jaGVjay1zYWxlcy1jaGFubmVscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLHFDQVdDO0FBYkQscURBQXFFO0FBRXRELEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUN0RSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2xFLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFaEUsTUFBTSxFQUFFLElBQUksRUFBRSxhQUFhLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDaEQsTUFBTSxFQUFFLGVBQWU7UUFDdkIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxhQUFhLENBQUM7S0FDdEMsQ0FBQyxDQUFBO0lBRUYsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLGFBQWEsQ0FBQyxNQUFNLGtCQUFrQixDQUFDLENBQUE7SUFDNUQsT0FBTyxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUMsQ0FBQTtBQUM5QixDQUFDIn0=