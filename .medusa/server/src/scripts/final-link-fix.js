"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = finalLinkFix;
const utils_1 = require("@medusajs/framework/utils");
async function finalLinkFix({ container }) {
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    logger.info("Executing Final Link Fix for India region...");
    try {
        // 1. Get India region
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name"],
            filters: { name: "India" }
        });
        if (regions.length === 0) {
            logger.error("India region not found.");
            return;
        }
        const regionId = regions[0].id;
        logger.info(`Found India region: ${regionId}`);
        const providers = ["pp_system_default", "pp_razorpay_razorpay"];
        // 2. Link each provider
        // We use remoteLink.create which should handle the link creation
        // If they already exist, we'll catch the error
        for (const providerId of providers) {
            try {
                logger.info(`Linking ${providerId} to ${regionId}...`);
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
                if (err.message.includes("already exists") || err.code === "23505") {
                    logger.info(`${providerId} is already linked.`);
                }
                else {
                    logger.error(`Error linking ${providerId}: ${err.message}`);
                }
            }
        }
        // 3. Final Verification check (simplified)
        const { data: finalCheck } = await query.graph({
            entity: "region",
            fields: ["id", "name", "payment_providers.id"],
            filters: { id: regionId }
        });
        logger.info("Final linked providers for India:");
        if (finalCheck[0].payment_providers) {
            finalCheck[0].payment_providers.forEach(p => logger.info(`- ${p.id}`));
        }
        else {
            logger.info("- No providers found after link attempt.");
        }
    }
    catch (err) {
        logger.error(`Error in finalLinkFix: ${err.message}`);
        if (err.stack)
            logger.error(err.stack);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmluYWwtbGluay1maXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9maW5hbC1saW5rLWZpeC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLCtCQXFFQztBQXZFRCxxREFBOEU7QUFFL0QsS0FBSyxVQUFVLFlBQVksQ0FBQyxFQUFFLFNBQVMsRUFBRTtJQUNwRCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQzNFLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDaEUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVsRSxNQUFNLENBQUMsSUFBSSxDQUFDLDhDQUE4QyxDQUFDLENBQUE7SUFFM0QsSUFBSSxDQUFDO1FBQ0Qsc0JBQXNCO1FBQ3RCLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3hDLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtTQUM3QixDQUFDLENBQUE7UUFFRixJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDdkIsTUFBTSxDQUFDLEtBQUssQ0FBQyx5QkFBeUIsQ0FBQyxDQUFBO1lBQ3ZDLE9BQU07UUFDVixDQUFDO1FBQ0QsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtRQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBRTlDLE1BQU0sU0FBUyxHQUFHLENBQUMsbUJBQW1CLEVBQUUsc0JBQXNCLENBQUMsQ0FBQTtRQUUvRCx3QkFBd0I7UUFDeEIsaUVBQWlFO1FBQ2pFLCtDQUErQztRQUUvQyxLQUFLLE1BQU0sVUFBVSxJQUFJLFNBQVMsRUFBRSxDQUFDO1lBQ2pDLElBQUksQ0FBQztnQkFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLFdBQVcsVUFBVSxPQUFPLFFBQVEsS0FBSyxDQUFDLENBQUE7Z0JBQ3RELE1BQU0sVUFBVSxDQUFDLE1BQU0sQ0FBQztvQkFDcEI7d0JBQ0ksQ0FBQyxlQUFPLENBQUMsTUFBTSxDQUFDLEVBQUU7NEJBQ2QsU0FBUyxFQUFFLFFBQVE7eUJBQ3RCO3dCQUNELENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFOzRCQUNmLG1CQUFtQixFQUFFLFVBQVU7eUJBQ2xDO3FCQUNKO2lCQUNKLENBQUMsQ0FBQTtnQkFDRixNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixVQUFVLEVBQUUsQ0FBQyxDQUFBO1lBQ3BELENBQUM7WUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNYLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxHQUFHLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRSxDQUFDO29CQUNqRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxxQkFBcUIsQ0FBQyxDQUFBO2dCQUNuRCxDQUFDO3FCQUFNLENBQUM7b0JBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsVUFBVSxLQUFLLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO2dCQUMvRCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFFRCwyQ0FBMkM7UUFDM0MsTUFBTSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDM0MsTUFBTSxFQUFFLFFBQVE7WUFDaEIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sRUFBRSxzQkFBc0IsQ0FBQztZQUM5QyxPQUFPLEVBQUUsRUFBRSxFQUFFLEVBQUUsUUFBUSxFQUFFO1NBQzVCLENBQUMsQ0FBQTtRQUVGLE1BQU0sQ0FBQyxJQUFJLENBQUMsbUNBQW1DLENBQUMsQ0FBQTtRQUNoRCxJQUFJLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1lBQ2xDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtRQUMxRSxDQUFDO2FBQU0sQ0FBQztZQUNKLE1BQU0sQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQTtRQUMzRCxDQUFDO0lBRUwsQ0FBQztJQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLDBCQUEwQixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUNyRCxJQUFJLEdBQUcsQ0FBQyxLQUFLO1lBQUUsTUFBTSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDMUMsQ0FBQztBQUNMLENBQUMifQ==