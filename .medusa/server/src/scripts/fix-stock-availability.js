"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fixStockAvailability;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function fixStockAvailability({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const salesChannelModuleService = container.resolve(utils_1.Modules.SALES_CHANNEL);
    // Step 1: Get the stock location
    const { data: stockLocations } = await query.graph({
        entity: "stock_location",
        fields: ["id", "name"],
    });
    if (!stockLocations.length) {
        logger.error("No stock locations found!");
        return;
    }
    const stockLocation = stockLocations[0];
    logger.info(`Found stock location: ${stockLocation.name} (${stockLocation.id})`);
    // Step 2: Get the sales channel
    const salesChannels = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    });
    if (!salesChannels.length) {
        logger.error("No Default Sales Channel found!");
        return;
    }
    const salesChannel = salesChannels[0];
    logger.info(`Found sales channel: ${salesChannel.name} (${salesChannel.id})`);
    // Step 3: Link stock location to sales channel
    logger.info("Linking stock location to sales channel...");
    try {
        await (0, core_flows_1.linkSalesChannelsToStockLocationWorkflow)(container).run({
            input: {
                id: stockLocation.id,
                add: [salesChannel.id],
            },
        });
        logger.info("✅ Linked stock location to sales channel!");
    }
    catch (e) {
        logger.warn(`Could not link (may already be linked): ${e.message}`);
    }
    // Step 4: Check variants and their inventory_quantity
    const { data: products } = await query.graph({
        entity: "product",
        fields: [
            "title",
            "variants.id",
            "variants.title",
            "variants.sku",
            "variants.manage_inventory",
            "variants.inventory_quantity",
        ],
    });
    logger.info(`Found ${products.length} products. Checking inventory...`);
    const { data: inventoryLevels } = await query.graph({
        entity: "inventory_level",
        fields: ["id", "inventory_item_id", "location_id", "stocked_quantity"],
    });
    logger.info(`Found ${inventoryLevels.length} inventory levels`);
    // Step 5: If inventory levels exist at wrong location, update them
    // First get all inventory items
    const { data: inventoryItems } = await query.graph({
        entity: "inventory_item",
        fields: ["id"],
    });
    logger.info(`Found ${inventoryItems.length} inventory items`);
    // Check which inventory items DON'T have levels at our stock location
    const itemsWithLevelAtLocation = new Set(inventoryLevels
        .filter((l) => l.location_id === stockLocation.id)
        .map((l) => l.inventory_item_id));
    const itemsWithoutLevel = inventoryItems.filter((item) => !itemsWithLevelAtLocation.has(item.id));
    if (itemsWithoutLevel.length > 0) {
        logger.info(`${itemsWithoutLevel.length} inventory items have no level at the stock location. Creating levels...`);
        const newLevels = itemsWithoutLevel.map((item) => ({
            inventory_item_id: item.id,
            location_id: stockLocation.id,
            stocked_quantity: Math.floor(Math.random() * (1000 - 500 + 1)) + 500,
        }));
        await (0, core_flows_1.createInventoryLevelsWorkflow)(container).run({
            input: {
                inventory_levels: newLevels,
            },
        });
        logger.info("✅ Created inventory levels for all items!");
    }
    else {
        logger.info("✅ All inventory items already have levels at the stock location.");
    }
    // Step 6: Print summary
    for (const product of products) {
        for (const variant of product.variants || []) {
            logger.info(`  ${product.title} / ${variant.title}: manage_inventory=${variant.manage_inventory}`);
        }
    }
    logger.info("Done! Please restart the dev server and check the product page.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4LXN0b2NrLWF2YWlsYWJpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2ZpeC1zdG9jay1hdmFpbGFiaWxpdHkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFPQSx1Q0FzSEM7QUE1SEQscURBQThFO0FBQzlFLDREQUdvQztBQUVyQixLQUFLLFVBQVUsb0JBQW9CLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDdEUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFBO0lBQ2hFLE1BQU0seUJBQXlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsYUFBYSxDQUFDLENBQUE7SUFFMUUsaUNBQWlDO0lBQ2pDLE1BQU0sRUFBRSxJQUFJLEVBQUUsY0FBYyxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQy9DLE1BQU0sRUFBRSxnQkFBZ0I7UUFDeEIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQztLQUN6QixDQUFDLENBQUE7SUFFRixJQUFJLENBQUMsY0FBYyxDQUFDLE1BQU0sRUFBRSxDQUFDO1FBQ3pCLE1BQU0sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQTtRQUN6QyxPQUFNO0lBQ1YsQ0FBQztJQUVELE1BQU0sYUFBYSxHQUFHLGNBQWMsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUN2QyxNQUFNLENBQUMsSUFBSSxDQUFDLHlCQUF5QixhQUFhLENBQUMsSUFBSSxLQUFLLGFBQWEsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBRWhGLGdDQUFnQztJQUNoQyxNQUFNLGFBQWEsR0FBRyxNQUFNLHlCQUF5QixDQUFDLGlCQUFpQixDQUFDO1FBQ3BFLElB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