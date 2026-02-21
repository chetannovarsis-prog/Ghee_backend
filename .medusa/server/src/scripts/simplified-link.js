"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = simplifiedLink;
async function simplifiedLink({ container }) {
    const remoteLink = container.resolve("remoteLink");
    const query = container.resolve("query");
    const logger = container.resolve("logger");
    logger.info("--- Simplified Linking Process ---");
    try {
        // 1. Get India region
        const { data: regions } = await query.graph({
            entity: "region",
            fields: ["id", "name"],
            filters: { name: "India" }
        });
        if (!regions || regions.length === 0) {
            logger.error("India region not found.");
            return;
        }
        const regionId = regions[0].id;
        logger.info(`Found India region: ${regionId}`);
        const providers = ["pp_system_default", "pp_razorpay_razorpay"];
        for (const providerId of providers) {
            try {
                logger.info(`Linking ${providerId} to ${regionId}...`);
                await remoteLink.create([
                    {
                        region: {
                            region_id: regionId,
                        },
                        payment: {
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
        logger.info("--- Process Finished ---");
    }
    catch (err) {
        logger.error(`Error in simplifiedLink: ${err.message}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2ltcGxpZmllZC1saW5rLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvc2ltcGxpZmllZC1saW5rLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EsaUNBb0RDO0FBcERjLEtBQUssVUFBVSxjQUFjLENBQUMsRUFBRSxTQUFTLEVBQUU7SUFDdEQsTUFBTSxVQUFVLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQTtJQUNsRCxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBQ3hDLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUE7SUFFMUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQ0FBb0MsQ0FBQyxDQUFBO0lBRWpELElBQUksQ0FBQztRQUNELHNCQUFzQjtRQUN0QixNQUFNLEVBQUUsSUFBSSxFQUFFLE9BQU8sRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUN4QyxNQUFNLEVBQUUsUUFBUTtZQUNoQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDO1lBQ3RCLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUU7U0FDN0IsQ0FBQyxDQUFBO1FBRUYsSUFBSSxDQUFDLE9BQU8sSUFBSSxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRSxDQUFDO1lBQ25DLE1BQU0sQ0FBQyxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQTtZQUN2QyxPQUFNO1FBQ1YsQ0FBQztRQUNELE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUE7UUFDOUIsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsUUFBUSxFQUFFLENBQUMsQ0FBQTtRQUU5QyxNQUFNLFNBQVMsR0FBRyxDQUFDLG1CQUFtQixFQUFFLHNCQUFzQixDQUFDLENBQUE7UUFFL0QsS0FBSyxNQUFNLFVBQVUsSUFBSSxTQUFTLEVBQUUsQ0FBQztZQUNqQyxJQUFJLENBQUM7Z0JBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxXQUFXLFVBQVUsT0FBTyxRQUFRLEtBQUssQ0FBQyxDQUFBO2dCQUN0RCxNQUFNLFVBQVUsQ0FBQyxNQUFNLENBQUM7b0JBQ3BCO3dCQUNJLE1BQU0sRUFBRTs0QkFDSixTQUFTLEVBQUUsUUFBUTt5QkFDdEI7d0JBQ0QsT0FBTyxFQUFFOzRCQUNMLG1CQUFtQixFQUFFLFVBQVU7eUJBQ2xDO3FCQUNKO2lCQUNKLENBQUMsQ0FBQTtnQkFDRixNQUFNLENBQUMsSUFBSSxDQUFDLHVCQUF1QixVQUFVLEVBQUUsQ0FBQyxDQUFBO1lBQ3BELENBQUM7WUFBQyxPQUFPLEdBQUcsRUFBRSxDQUFDO2dCQUNYLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLElBQUksR0FBRyxDQUFDLElBQUksS0FBSyxPQUFPLENBQUMsRUFBRSxDQUFDO29CQUMvRSxNQUFNLENBQUMsSUFBSSxDQUFDLEdBQUcsVUFBVSxxQkFBcUIsQ0FBQyxDQUFBO2dCQUNuRCxDQUFDO3FCQUFNLENBQUM7b0JBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsVUFBVSxLQUFLLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO2dCQUMvRCxDQUFDO1lBQ0wsQ0FBQztRQUNMLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUE7SUFFM0MsQ0FBQztJQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDWCxNQUFNLENBQUMsS0FBSyxDQUFDLDRCQUE0QixHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUMzRCxDQUFDO0FBQ0wsQ0FBQyJ9