"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkRegionPayment;
const utils_1 = require("@medusajs/framework/utils");
async function checkRegionPayment({ container }) {
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    logger.info("Checking India region payment providers...");
    try {
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name", "currency_code", "payment_providers.*"],
            filters: { name: "India" }
        });
        if (regions.length === 0) {
            logger.error("India region not found.");
            return;
        }
        const india = regions[0];
        logger.info(`Region: ${india.name} (${india.currency_code})`);
        logger.info("Associated Payment Providers:");
        if (india.payment_providers && india.payment_providers.length > 0) {
            india.payment_providers.forEach(p => {
                logger.info(`- ID: ${p.id}`);
            });
        }
        else {
            logger.info("No payment providers associated with this region.");
        }
    }
    catch (err) {
        logger.error(`Error checking region payments: ${err.message}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stcmVnaW9uLXBheW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9jaGVjay1yZWdpb24tcGF5bWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLHFDQWdDQztBQWxDRCxxREFBcUU7QUFFdEQsS0FBSyxVQUFVLGtCQUFrQixDQUFDLEVBQUUsU0FBUyxFQUFFO0lBQzFELE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDaEUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVsRSxNQUFNLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxDQUFDLENBQUE7SUFFekQsSUFBSSxDQUFDO1FBQ0QsTUFBTSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDeEMsTUFBTSxFQUFFLFFBQVE7WUFDaEIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxlQUFlLEVBQUUscUJBQXFCLENBQUM7WUFDOUQsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtTQUM3QixDQUFDLENBQUE7UUFFRixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1lBQ3ZDLE9BQU07UUFDVixDQUFDO1FBRUQsTUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxLQUFLLENBQUMsSUFBSSxLQUFLLEtBQUssQ0FBQyxhQUFhLEdBQUcsQ0FBQyxDQUFBO1FBQzdELE1BQU0sQ0FBQyxJQUFJLENBQUMsK0JBQStCLENBQUMsQ0FBQTtRQUM1QyxJQUFJLEtBQUssQ0FBQyxpQkFBaUIsSUFBSSxLQUFLLENBQUMsaUJBQWlCLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1lBQ2hFLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUU7Z0JBQ2hDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtZQUNoQyxDQUFDLENBQUMsQ0FBQTtRQUNOLENBQUM7YUFBTSxDQUFDO1lBQ0osTUFBTSxDQUFDLElBQUksQ0FBQyxtREFBbUQsQ0FBQyxDQUFBO1FBQ3BFLENBQUM7SUFFTCxDQUFDO0lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsbUNBQW1DLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBQ2xFLENBQUM7QUFDTCxDQUFDIn0=