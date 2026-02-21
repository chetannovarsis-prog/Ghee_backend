"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = finalLinkFixV2;
const utils_1 = require("@medusajs/framework/utils");
async function finalLinkFixV2({ container }) {
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const regionModule = container.resolve(utils_1.Modules.REGION);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    logger.info("Executing Final Link Fix V2 for India region...");
    try {
        // 1. Get India region using region module directly
        const regions = await regionModule.listRegions({
            name: "India"
        });
        if (regions.length === 0) {
            logger.error("India region not found.");
            return;
        }
        const regionId = regions[0].id;
        logger.info(`Found India region: ${regionId}`);
        const providers = ["pp_system_default", "pp_razorpay_razorpay"];
        // 2. Link each provider
        for (const providerId of providers) {
            try {
                logger.info(`Linking ${providerId} to ${regionId}...`);
                // In V2, the link is between Region and PaymentProvider
                // The key for PaymentProvider link is usually just 'payment' or 'payment_provider'
                // However, the standard Link definition is Region -> PaymentProvider
                await remoteLink.create([
                    {
                        [utils_1.Modules.REGION]: {
                            region_id: regionId,
                        },
                        [utils_1.Modules.PAYMENT]: {
                            payment_provider_id: providerId,
                        },
                    },
                ]);
                logger.info(`Successfully linked ${providerId}`);
            }
            catch (err) {
                if (err.message.includes("already exists") || (err.code && err.code === "23505")) {
                    logger.info(`${providerId} is already linked.`);
                }
                else {
                    logger.error(`Error linking ${providerId}: ${err.message}`);
                }
            }
        }
        logger.info("Final Link Fix V2 completed.");
    }
    catch (err) {
        logger.error(`Error in finalLinkFixV2: ${err.message}`);
        if (err.stack)
            logger.error(err.stack);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluYWwtbGluay1maXgtdjIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9maW5hbC1saW5rLWZpeC12Mi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGlDQXdEQztBQTFERCxxREFBOEU7QUFFL0QsS0FBSyxVQUFVLGNBQWMsQ0FBQyxFQUFFLFNBQVMsRUFBRTtJQUN0RCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQzNFLE1BQU0sWUFBWSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ3RELE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFbEUsTUFBTSxDQUFDLElBQUksQ0FBQyxpREFBaUQsQ0FBQyxDQUFBO0lBRTlELElBQUksQ0FBQztRQUNELG1EQUFtRDtRQUNuRCxNQUFNLE9BQU8sR0FBRyxNQUFNLFlBQVksQ0FBQyxXQUFXLENBQUM7WUFDM0MsSUFBSSxFQUFFLE9BQU87U0FDaEIsQ0FBQyxDQUFBO1FBRUYsSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ3ZCLE1BQU0sQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQTtZQUN2QyxPQUFNO1FBQ1YsQ0FBQztRQUNELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUU5QyxNQUFNLFNBQVMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDLENBQUE7UUFFL0Qsd0JBQXdCO1FBQ3hCLEtBQUssTUFBTSxVQUFVLElBQUksU0FBUyxFQUFFLENBQUM7WUFDakMsSUFBSSxDQUFDO2dCQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsV0FBVyxVQUFVLE9BQU8sUUFBUSxLQUFLLENBQUMsQ0FBQTtnQkFDdEQsd0RBQXdEO2dCQUN4RCxtRkFBbUY7Z0JBQ25GLHFFQUFxRTtnQkFFckUsTUFBTSxVQUFVLENBQUMsTUFBTSxDQUFDO29CQUNwQjt3QkFDSSxDQUFDLGVBQU8sQ0FBQyxNQUFNLENBQUMsRUFBRTs0QkFDZCxTQUFTLEVBQUUsUUFBUTt5QkFDdEI7d0JBQ0QsQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLEVBQUU7NEJBQ2YsbUJBQW1CLEVBQUUsVUFBVTt5QkFDbEM7cUJBQ0o7aUJBQ0osQ0FBQyxDQUFBO2dCQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLFVBQVUsRUFBRSxDQUFDLENBQUE7WUFDcEQsQ0FBQztZQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7Z0JBQ1gsSUFBSSxHQUFHLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE9BQU8sQ0FBQyxFQUFFLENBQUM7b0JBQy9FLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxVQUFVLHFCQUFxQixDQUFDLENBQUE7Z0JBQ25ELENBQUM7cUJBQU0sQ0FBQztvQkFDSixNQUFNLENBQUMsS0FBSyxDQUFDLGlCQUFpQixVQUFVLEtBQUssR0FBRyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7Z0JBQy9ELENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsOEJBQThCLENBQUMsQ0FBQTtJQUUvQyxDQUFDO0lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsNEJBQTRCLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQ3ZELElBQUksR0FBRyxDQUFDLEtBQUs7WUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUMxQyxDQUFDO0FBQ0wsQ0FBQyJ9