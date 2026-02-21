"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = addRazorpayToRegion;
const utils_1 = require("@medusajs/framework/utils");
async function addRazorpayToRegion({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const paymentModuleService = container.resolve(utils_1.Modules.PAYMENT);
    // List all payment providers
    const providers = await paymentModuleService.listPaymentProviders({ is_enabled: true }, { take: 50 });
    logger.info(`All registered payment providers: ${providers.map((p) => p.id).join(", ")}`);
    // Get India region
    const { data: regions } = await query.graph({
        entity: "region",
        fields: ["id", "name", "currency_code"],
    });
    const indiaRegion = regions.find((r) => r.name === "India" || r.currency_code === "inr");
    if (!indiaRegion) {
        logger.error("India region not found!");
        return;
    }
    logger.info(`India region: ${indiaRegion.id}`);
    // Find Razorpay provider
    const razorpayProvider = providers.find((p) => p.id.includes("razorpay"));
    if (!razorpayProvider) {
        logger.error("Razorpay NOT registered! Available: " + providers.map((p) => p.id).join(", "));
        return;
    }
    logger.info(`Razorpay provider ID: ${razorpayProvider.id}`);
    // In Medusa v2, the link between payment_provider and region
    // is stored in the `region_payment_provider` table.
    // We must use the RemoteLink service to create this link.
    const remoteLink = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    try {
        await remoteLink.create([
            {
                [utils_1.Modules.REGION]: {
                    region_id: indiaRegion.id,
                },
                [utils_1.Modules.PAYMENT]: {
                    payment_provider_id: razorpayProvider.id,
                },
            }
        ]);
        logger.info(`✅ Linked ${razorpayProvider.id} to India region via RemoteLink!`);
    }
    catch (e) {
        if (e.message?.includes("duplicate") || e.message?.includes("already exists")) {
            logger.info("Link already exists, that's fine!");
        }
        else {
            logger.error(`Link creation failed: ${e.message}`);
        }
    }
    // Verify via store API query
    const { data: regionPaymentProviders } = await query.graph({
        entity: "region",
        fields: ["id", "name", "payment_providers.*"],
        filters: { id: [indiaRegion.id] },
    });
    logger.info(`India region payment providers: ${JSON.stringify(regionPaymentProviders[0]?.payment_providers?.map((p) => p.id))}`);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWRkLXJhem9ycGF5LXRvLXJlZ2lvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2FkZC1yYXpvcnBheS10by1yZWdpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSxzQ0FpRUM7QUFuRUQscURBQThFO0FBRS9ELEtBQUssVUFBVSxtQkFBbUIsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUN2RSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2xFLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDaEUsTUFBTSxvQkFBb0IsR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUUvRCw2QkFBNkI7SUFDN0IsTUFBTSxTQUFTLEdBQUcsTUFBTSxvQkFBb0IsQ0FBQyxvQkFBb0IsQ0FDL0QsRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLEVBQ3BCLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUNiLENBQUE7SUFDRCxNQUFNLENBQUMsSUFBSSxDQUFDLHFDQUFzQyxTQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7SUFFekcsbUJBQW1CO0lBQ25CLE1BQU0sRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzFDLE1BQU0sRUFBRSxRQUFRO1FBQ2hCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsZUFBZSxDQUFDO0tBQ3hDLENBQUMsQ0FBQTtJQUNGLE1BQU0sV0FBVyxHQUFJLE9BQWlCLENBQUMsSUFBSSxDQUN6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