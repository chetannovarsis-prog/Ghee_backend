"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedUserData;
const utils_1 = require("@medusajs/framework/utils");
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const core_flows_1 = require("@medusajs/medusa/core-flows");
const updateStoreCurrencies = (0, workflows_sdk_1.createWorkflow)("update-store-currencies", (input) => {
    const normalizedInput = (0, workflows_sdk_1.transform)({ input }, (data) => {
        return {
            selector: { id: data.input.store_id },
            update: {
                supported_currencies: data.input.supported_currencies.map((currency) => {
                    return {
                        currency_code: currency.currency_code,
                        is_default: currency.is_default ?? false,
                    };
                }),
            },
        };
    });
    const stores = (0, core_flows_1.updateStoresStep)(normalizedInput);
    return new workflows_sdk_1.WorkflowResponse(stores);
});
async function seedUserData({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const link = container.resolve(utils_1.ContainerRegistrationKeys.LINK);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const fulfillmentModuleService = container.resolve(utils_1.Modules.FULFILLMENT);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    const storeModuleService = container.resolve(utils_1.Modules.STORE);
    const countries = ["in", "us", "gb", "de", "dk", "se", "fr", "es", "it"];
    logger.info("Seeding store data...");
    const [store] = await storeModuleService.listStores();
    let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });
    if (!defaultSalesChannel.length) {
        const { result: salesChannelResult } = await (0, core_flows_1.createSalesChannelsWorkflow)(container).run({
            input: {
                salesChannelsData: [
                    {
                        name: "Default Sales Channel",
                    },
                ],
            },
        });
        defaultSalesChannel = salesChannelResult;
    }
    await updateStoreCurrencies(container).run({
        input: {
            store_id: store.id,
            supported_currencies: [
                {
                    currency_code: "inr",
                    is_default: true,
                },
                {
                    currency_code: "usd",
                },
            ],
        },
    });
    await (0, core_flows_1.updateStoresWorkflow)(container).run({
        input: {
            selector: { id: store.id },
            update: {
                default_sales_channel_id: defaultSalesChannel[0].id,
            },
        },
    });
    logger.info("Seeding region data...");
    const { result: regionResult } = await (0, core_flows_1.createRegionsWorkflow)(container).run({
        input: {
            regions: [
                {
                    name: "India",
                    currency_code: "inr",
                    countries: ["in"],
                    payment_providers: ["pp_system_default"],
                },
            ],
        },
    });
    const region = regionResult[0];
    logger.info("Finished seeding regions.");
    // Stock Location
    logger.info("Seeding stock location data...");
    let stockLocation;
    try {
        const { result: stockLocationResult } = await (0, core_flows_1.createStockLocationsWorkflow)(container).run({
            input: {
                locations: [
                    {
                        name: "Main Warehouse",
                        address: {
                            city: "Indore",
                            country_code: "IN",
                            address_1: "Warehouse 1",
                        },
                    },
                ],
            },
        });
        stockLocation = stockLocationResult[0];
    }
    catch (e) {
        // assume it exists or handle duplication if needed, but for now we create as it's a seed
        // If it fails, we might need to fetch existing.
        const { data: stockLocations } = await query.graph({
            entity: "stock_location",
            fields: ["id"],
        });
        if (stockLocations.length > 0) {
            stockLocation = stockLocations[0];
        }
    }
    if (stockLocation) {
        await (0, core_flows_1.updateStoresWorkflow)(container).run({
            input: {
                selector: { id: store.id },
                update: {
                    default_location_id: stockLocation.id,
                },
            },
        });
        await link.create({
            [utils_1.Modules.STOCK_LOCATION]: {
                stock_location_id: stockLocation.id,
            },
            [utils_1.Modules.FULFILLMENT]: {
                fulfillment_provider_id: "manual_manual",
            },
        });
    }
    logger.info("Seeding fulfillment data...");
    const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
        type: "default",
    });
    let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;
    if (!shippingProfile) {
        const { result: shippingProfileResult } = await (0, core_flows_1.createShippingProfilesWorkflow)(container).run({
            input: {
                data: [
                    {
                        name: "Default Shipping Profile",
                        type: "default",
                    },
                ],
            },
        });
        shippingProfile = shippingProfileResult[0];
    }
    const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
        name: "India Delivery",
        type: "shipping",
        service_zones: [
            {
                name: "India",
                geo_zones: [
                    {
                        country_code: "in",
                        type: "country",
                    },
                ],
            },
        ],
    });
    if (stockLocation) {
        await link.create({
            [utils_1.Modules.STOCK_LOCATION]: {
                stock_location_id: stockLocation.id,
            },
            [utils_1.Modules.FULFILLMENT]: {
                fulfillment_set_id: fulfillmentSet.id,
            },
        });
    }
    await (0, core_flows_1.createShippingOptionsWorkflow)(container).run({
        input: [
            {
                name: "Standard Shipping",
                price_type: "flat",
                provider_id: "manual_manual",
                service_zone_id: fulfillmentSet.service_zones[0].id,
                shipping_profile_id: shippingProfile.id,
                type: {
                    label: "Standard",
                    description: "Standard delivery",
                    code: "standard",
                },
                prices: [
                    {
                        currency_code: "inr",
                        amount: 50,
                    },
                    {
                        region_id: region.id,
                        amount: 50,
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
        ],
    });
    logger.info("Finished seeding fulfillment data.");
    // API Key
    logger.info("Seeding publishable API key data...");
    let publishableApiKey = null;
    const { data } = await query.graph({
        entity: "api_key",
        fields: ["id"],
        filters: {
            type: "publishable",
        },
    });
    publishableApiKey = data?.[0];
    if (!publishableApiKey) {
        const { result: [publishableApiKeyResult], } = await (0, core_flows_1.createApiKeysWorkflow)(container).run({
            input: {
                api_keys: [
                    {
                        title: "Webshop",
                        type: "publishable",
                        created_by: "system",
                    },
                ],
            },
        });
        publishableApiKey = publishableApiKeyResult;
    }
    await (0, core_flows_1.linkSalesChannelsToApiKeyWorkflow)(container).run({
        input: {
            id: publishableApiKey.id,
            add: [defaultSalesChannel[0].id],
        },
    });
    logger.info("Finished seeding publishable API key data.");
    logger.info("Seeding user product data...");
    // Categories
    // categories: Atta, Ghee, Health
    const { result: categoryResult } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
        input: {
            product_categories: [
                {
                    name: "Atta",
                    is_active: true,
                    handle: "atta"
                },
                {
                    name: "Ghee",
                    is_active: true,
                    handle: "ghee-cat"
                },
                {
                    name: "Health",
                    is_active: true,
                    handle: "health"
                }
            ],
        },
    });
    const attaCatId = categoryResult.find((c) => c.name === "Atta")?.id;
    const gheeCatId = categoryResult.find((c) => c.name === "Ghee")?.id;
    const healthCatId = categoryResult.find((c) => c.name === "Health")?.id;
    const productsData = [
        {
            title: "Multigrain Atta",
            handle: "multigrain-atta",
            category_ids: [attaCatId],
            description: "Healthy Multigrain Atta",
            price: 180,
            variantTitle: "1 Pack",
            sku: "MULTI-ATTA-1"
        },
        {
            title: "Whole Wheat Atta",
            handle: "whole-wheat-atta",
            category_ids: [attaCatId],
            description: "Pure Whole Wheat Atta",
            price: 150,
            variantTitle: "1 Pack",
            sku: "WHEAT-ATTA-1"
        },
        {
            title: "Jowar Atta",
            handle: "jowar-atta",
            category_ids: [attaCatId],
            description: "Fresh Jowar Atta",
            price: 170,
            variantTitle: "1 Pack",
            sku: "JOWAR-ATTA-1"
        },
        {
            title: "Bajra Atta",
            handle: "bajra-atta",
            category_ids: [attaCatId],
            description: "Healthy Bajra Atta",
            price: 130,
            variantTitle: "1 Pack",
            sku: "BAJRA-ATTA-1"
        },
        {
            title: "Moringa Sattu",
            handle: "moringa-sattu",
            category_ids: [attaCatId, healthCatId],
            description: "Moringa Sattu 500g Pack",
            price: 220,
            variantTitle: "500g",
            sku: "MORINGA-SATTU-500"
        },
        {
            title: "Sattu",
            handle: "sattu",
            category_ids: [attaCatId],
            description: "Sattu 500g Pack",
            price: 190,
            variantTitle: "500g",
            sku: "SATTU-500"
        },
        {
            title: "Gousarram Capsule",
            handle: "gousarram-capsule",
            category_ids: [healthCatId],
            description: "Gousarram Capsule 30 pcs pack bottle",
            price: 750,
            variantTitle: "30 pcs Bottle",
            sku: "GOUSARRAM-CAP-30"
        },
        {
            title: "Ghee",
            handle: "ghee-500",
            category_ids: [gheeCatId],
            description: "Pure Ghee 500g Bottle",
            price: 1800,
            variantTitle: "500g Bottle",
            sku: "GHEE-500"
        }
    ];
    const productsInput = productsData.map(p => ({
        title: p.title,
        handle: p.handle,
        category_ids: p.category_ids.filter(Boolean),
        description: p.description,
        status: utils_1.ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        options: [
            {
                title: "Option",
                values: [p.variantTitle],
            },
        ],
        variants: [
            {
                title: p.variantTitle,
                sku: p.sku,
                options: {
                    Option: p.variantTitle
                },
                prices: [
                    {
                        amount: p.price,
                        currency_code: "inr",
                    },
                    {
                        amount: Math.round(p.price / 84), // approx USD
                        currency_code: "usd",
                    },
                ],
            },
        ],
        sales_channels: [
            {
                id: defaultSalesChannel[0].id,
            },
        ],
        // Placeholder image
        images: [{ url: "https://placehold.co/600x400?text=" + encodeURIComponent(p.title) }]
    }));
    await (0, core_flows_1.createProductsWorkflow)(container).run({
        input: {
            products: productsInput,
        },
    });
    logger.info("Finished seeding product data.");
    logger.info("Seeding inventory levels...");
    // Get all inventory items (created by product creation)
    const { data: inventoryItems } = await query.graph({
        entity: "inventory_item",
        fields: ["id"],
    });
    const inventoryLevels = [];
    if (stockLocation) {
        for (const inventoryItem of inventoryItems) {
            // Random stock 500-1000
            const randomStock = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
            const inventoryLevel = {
                location_id: stockLocation.id,
                stocked_quantity: randomStock,
                inventory_item_id: inventoryItem.id,
            };
            inventoryLevels.push(inventoryLevel);
        }
        await (0, core_flows_1.createInventoryLevelsWorkflow)(container).run({
            input: {
                inventory_levels: inventoryLevels,
            },
        });
    }
    logger.info("Finished seeding inventory levels data.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC11c2VyLWRhdGEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9zZWVkLXVzZXItZGF0YS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQXlEQSwrQkFxYkM7QUE3ZUQscURBSW1DO0FBQ25DLHFFQUkyQztBQUMzQyw0REFlcUM7QUFHckMsTUFBTSxxQkFBcUIsR0FBRyxJQUFBLDhCQUFjLEVBQzFDLHlCQUF5QixFQUN6QixDQUFDLEtBR0EsRUFBRSxFQUFFO0lBQ0gsTUFBTSxlQUFlLEdBQUcsSUFBQSx5QkFBUyxFQUFDLEVBQUUsS0FBSyxFQUFFLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtRQUNwRCxPQUFPO1lBQ0wsUUFBUSxFQUFFLEVBQUUsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO1lBQ3JDLE1BQU0sRUFBRTtnQkFDTixvQkFBb0IsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLG9CQUFvQixDQUFDLEdBQUcsQ0FDdkQsQ0FBQyxRQUFRLEVBQUUsRUFBRTtvQkFDWCxPQUFPO3dCQUNMLGFBQWEsRUFBRSxRQUFRLENBQUMsYUFBYTt3QkFDckMsVUFBVSxFQUFFLFFBQVEsQ0FBQyxVQUFVLElBQUksS0FBSztxQkFDekMsQ0FBQztnQkFDSixDQUFDLENBQ0Y7YUFDRjtTQUNGLENBQUM7SUFDSixDQUFDLENBQUMsQ0FBQztJQUVILE1BQU0sTUFBTSxHQUFHLElBQUEsNkJBQWdCLEVBQUMsZUFBZSxDQUFDLENBQUM7SUFFakQsT0FBTyxJQUFJLGdDQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3RDLENBQUMsQ0FDRixDQUFDO0FBRWEsS0FBSyxVQUFVLFlBQVksQ0FBQyxFQUFFLFNBQVMsRUFBWTtJQUNoRSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25FLE1BQU0sSUFBSSxHQUFHLFNB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