"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = linkAllToIndia;
const utils_1 = require("@medusajs/framework/utils");
async function linkAllToIndia({ container }) {
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.REMOTE_LINK);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    logger.info("--- Starting Linking Process ---");
    try {
        // 1. Find the India region
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name"],
            filters: { name: "India" }
        });
        if (!regions || regions.length === 0) {
            logger.error("Could not find a region named 'India'.");
            return;
        }
        const regionId = regions[0].id;
        logger.info(`Found India region with ID: ${regionId}`);
        const providersToLink = [
            { id: "pp_system_default", label: "COD" },
            { id: "pp_razorpay_razorpay", label: "Razorpay" }
        ];
        for (const provider of providersToLink) {
            logger.info(`Attempting to link ${provider.label} (${provider.id})...`);
            try {
                await remoteLink.create([
                    {
                        [utils_1.Modules.REGION]: {
                            region_id: regionId,
                        },
                        [utils_1.Modules.PAYMENT]: {
                            payment_provider_id: provider.id,
                        },
                    },
                ]);
                logger.info(`Successfully linked ${provider.id}`);
            }
            catch (error) {
                if (error.message.includes("already exists") || error.code === "23505") {
                    logger.info(`${provider.id} is already linked to this region.`);
                }
                else {
                    logger.error(`Failed to link ${provider.id}: ${error.message}`);
                    console.error(error);
                }
            }
        }
        logger.info("--- Linking Process Finished ---");
    }
    catch (err) {
        logger.error(`Critical error during linking: ${err.message}`);
        console.error(err);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGluay1hbGwtdG8taW5kaWEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9saW5rLWFsbC10by1pbmRpYS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLGlDQTBEQztBQTVERCxxREFBOEU7QUFFL0QsS0FBSyxVQUFVLGNBQWMsQ0FBQyxFQUFFLFNBQVMsRUFBRTtJQUN0RCxNQUFNLFVBQVUsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLFdBQVcsQ0FBQyxDQUFBO0lBQzNFLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDaEUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVsRSxNQUFNLENBQUMsSUFBSSxDQUFDLGtDQUFrQyxDQUFDLENBQUE7SUFFL0MsSUFBSSxDQUFDO1FBQ0QsMkJBQTJCO1FBQzNCLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1lBQ3hDLE1BQU0sRUFBRSxRQUFRO1lBQ2hCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLENBQUM7WUFDdEIsT0FBTyxFQUFFLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRTtTQUM3QixDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQyxFQUFFLENBQUM7WUFDbkMsTUFBTSxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFBO1lBQ3RELE9BQU07UUFDVixDQUFDO1FBRUQsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQTtRQUM5QixNQUFNLENBQUMsSUFBSSxDQUFDLCtCQUErQixRQUFRLEVBQUUsQ0FBQyxDQUFBO1FBRXRELE1BQU0sZUFBZSxHQUFHO1lBQ3BCLEVBQUUsRUFBRSxFQUFFLG1CQUFtQixFQUFFLEtBQUssRUFBRSxLQUFLLEVBQUU7WUFDekMsRUFBRSxFQUFFLEVBQUUsc0JBQXNCLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRTtTQUNwRCxDQUFBO1FBRUQsS0FBSyxNQUFNLFFBQVEsSUFBSSxlQUFlLEVBQUUsQ0FBQztZQUNyQyxNQUFNLENBQUMsSUFBSSxDQUFDLHNCQUFzQixRQUFRLENBQUMsS0FBSyxLQUFLLFFBQVEsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFBO1lBQ3ZFLElBQUksQ0FBQztnQkFDRCxNQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUM7b0JBQ3BCO3dCQUNJLENBQUMsZUFBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFOzRCQUNkLFNBQVMsRUFBRSxRQUFRO3lCQUN0Qjt3QkFDRCxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTs0QkFDZixtQkFBbUIsRUFBRSxRQUFRLENBQUMsRUFBRTt5QkFDbkM7cUJBQ0o7aUJBQ0osQ0FBQyxDQUFBO2dCQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFBO1lBQ3JELENBQUM7WUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO2dCQUNiLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxLQUFLLENBQUMsSUFBSSxLQUFLLE9BQU8sRUFBRSxDQUFDO29CQUNyRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsUUFBUSxDQUFDLEVBQUUsb0NBQW9DLENBQUMsQ0FBQTtnQkFDbkUsQ0FBQztxQkFBTSxDQUFDO29CQUNKLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLFFBQVEsQ0FBQyxFQUFFLEtBQUssS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUE7b0JBQy9ELE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7Z0JBQ3hCLENBQUM7WUFDTCxDQUFDO1FBQ0wsQ0FBQztRQUVELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLENBQUMsQ0FBQTtJQUVuRCxDQUFDO0lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0NBQWtDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQzdELE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUE7SUFDdEIsQ0FBQztBQUNMLENBQUMifQ==