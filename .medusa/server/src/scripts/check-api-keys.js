"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkApiKeyLinks;
const utils_1 = require("@medusajs/framework/utils");
async function checkApiKeyLinks({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { data: apiKeys } = await query.graph({
        entity: "api_key",
        fields: ["id", "title", "token", "sales_channels.name", "sales_channels.id"],
        filters: {
            type: ["publishable"]
        }
    });
    logger.info(`Found ${apiKeys.length} publishable API keys:`);
    console.table(apiKeys.map(k => ({
        id: k.id,
        title: k.title,
        channels: k.sales_channels?.map(sc => sc.name).join(", ")
    })));
    // Also log the first token for comparison with storefront .env
    if (apiKeys.length > 0) {
        logger.info(`First API Key Token: ${apiKeys[0].token}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stYXBpLWtleXMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9jaGVjay1hcGkta2V5cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLG1DQXVCQztBQXpCRCxxREFBcUU7QUFFdEQsS0FBSyxVQUFVLGdCQUFnQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ3BFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVoRSxNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMxQyxNQUFNLEVBQUUsU0FBUztRQUNqQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxxQkFBcUIsRUFBRSxtQkFBbUIsQ0FBQztRQUM1RSxPQUFPLEVBQUU7WUFDUCxJQUFJLEVBQUUsQ0FBQyxhQUFhLENBQUM7U0FDdEI7S0FDRixDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsT0FBTyxDQUFDLE1BQU0sd0JBQXdCLENBQUMsQ0FBQTtJQUM1RCxPQUFPLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlCLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBRTtRQUNSLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSztRQUNkLFFBQVEsRUFBRSxDQUFDLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0tBQzNELENBQUMsQ0FBQyxDQUFDLENBQUE7SUFFSiwrREFBK0Q7SUFDL0QsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRSxDQUFDO1FBQ3ZCLE1BQU0sQ0FBQyxJQUFJLENBQUMsd0JBQXdCLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO0lBQ3pELENBQUM7QUFDSCxDQUFDIn0=