"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = setupIndiaShipping;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function setupIndiaShipping({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const fulfillmentModule = container.resolve(utils_1.Modules.FULFILLMENT);
    const regionModule = container.resolve(utils_1.Modules.REGION);
    logger.info("Starting India Shipping Setup (v4)...");
    try {
        // 1. Get India region
        const regions = await regionModule.listRegions({ name: "India" });
        const indiaRegion = regions[0];
        if (!indiaRegion) {
            throw new Error("India region not found. Please create it first.");
        }
        logger.info(`Found India region: ${indiaRegion.id}`);
        // 2. Get Fulfillment Set
        const [fulfillmentSet] = await fulfillmentModule.listFulfillmentSets({
            name: ["India Warehouse delivery", "European Warehouse delivery"],
        });
        if (!fulfillmentSet) {
            throw new Error("Default fulfillment set not found.");
        }
        logger.info(`Using fulfillment set: ${fulfillmentSet.id}`);
        // 3. Check for India Service Zone
        let indiaZone = (await fulfillmentModule.listServiceZones({
            name: "India",
            fulfillment_set: { id: fulfillmentSet.id }
        }))[0];
        if (!indiaZone) {
            logger.info("Creating India Service Zone directly...");
            indiaZone = await fulfillmentModule.createServiceZones({
                name: "India",
                fulfillment_set_id: fulfillmentSet.id,
                geo_zones: [
                    {
                        type: "country",
                        country_code: "in",
                    }
                ]
            });
            logger.info(`Created India Service Zone: ${indiaZone.id}`);
        }
        else {
            logger.info(`India Service Zone already exists: ${indiaZone.id}`);
        }
        // 4. Get Default Shipping Profile
        const profiles = await fulfillmentModule.listShippingProfiles({
            name: ["Default", "Default Shipping Profile"],
        });
        const shippingProfile = profiles[0];
        if (!shippingProfile) {
            throw new Error("Default shipping profile not found.");
        }
        logger.info(`Using shipping profile: ${shippingProfile.name} (${shippingProfile.id})`);
        // 5. Check if Shipping Option already exists and delete it to update
        const existingOptions = await fulfillmentModule.listShippingOptions({
            name: "Standard Shipping",
            service_zone: { id: indiaZone.id }
        });
        if (existingOptions.length > 0) {
            logger.info("Found existing Standard Shipping option. Deleting it to update...");
            // In v2 we can use the fulfillment module direct delete or workflow
            for (const opt of existingOptions) {
                await fulfillmentModule.deleteShippingOptions(opt.id);
            }
            logger.info("Existing options deleted.");
        }
        // 6. Create Shipping Option for India
        logger.info("Creating Free Shipping Option for India...");
        // IMPORTANT: In Medusa v2, createShippingOptionsWorkflow expects an ARRAY as input
        await (0, core_flows_1.createShippingOptionsWorkflow)(container).run({
            input: [
                {
                    name: "Standard Shipping",
                    price_type: "flat",
                    provider_id: "manual_manual",
                    service_zone_id: indiaZone.id,
                    shipping_profile_id: shippingProfile.id,
                    type: {
                        label: "Standard",
                        description: "Standard delivery",
                        code: "standard",
                    },
                    prices: [
                        {
                            currency_code: "inr",
                            amount: 0,
                        },
                    ],
                    rules: [
                        {
                            attribute: "enabled_in_store",
                            value: "true",
                            operator: "eq",
                        },
                        {
                            attribute: "is_return",
                            value: "false",
                            operator: "eq",
                        },
                    ],
                },
                {
                    name: "Cash on Delivery",
                    price_type: "flat",
                    provider_id: "manual_manual",
                    service_zone_id: indiaZone.id,
                    shipping_profile_id: shippingProfile.id,
                    type: {
                        label: "COD",
                        description: "Pay on delivery",
                        code: "cod",
                    },
                    prices: [
                        {
                            currency_code: "inr",
                            amount: 5000, // 50 INR fee for COD
                        },
                    ],
                    rules: [
                        {
                            attribute: "enabled_in_store",
                            value: "true",
                            operator: "eq",
                        },
                    ],
                },
            ],
        });
        logger.info("India Shipping Option created successfully.");
        logger.info("India Shipping Setup COMPLETE!");
    }
    catch (err) {
        logger.error(`Error during India Shipping Setup: ${err.message}`);
        if (err.stack) {
            logger.error(err.stack);
        }
        throw err;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2V0dXAtaW5kaWEtc2hpcHBpbmcuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9zZXR1cC1pbmRpYS1zaGlwcGluZy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUtBLHFDQWlKQztBQXBKRCxxREFBOEU7QUFDOUUsNERBQTJFO0FBRTVELEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUN0RSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFBO0lBQ2xFLE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7SUFDaEUsTUFBTSxZQUFZLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsTUFBTSxDQUFDLENBQUE7SUFFdEQsTUFBTSxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFBO0lBRXBELElBQUksQ0FBQztRQUNILHNCQUFzQjtRQUN0QixNQUFNLE9BQU8sR0FBRyxNQUFNLFlBQVksQ0FBQyxXQUFXLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUNqRSxNQUFNLFdBQVcsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUE7UUFDOUIsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1lBQ2pCLE1BQU0sSUFBSSxLQUFLLENBQUMsaURBQWlELENBQUMsQ0FBQTtRQUNwRSxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyx1QkFBdUIsV0FBVyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFFcEQseUJBQXlCO1FBQ3pCLE1BQU0sQ0FBQyxjQUFjLENBQUMsR0FBRyxNQUFNLGlCQUFpQixDQUFDLG1CQUFtQixDQUFDO1lBQ25FLElBQUksRUFBRSxDQUFDLDBCQUEwQixFQUFFLDZCQUE2QixDQUFDO1NBQ2xF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