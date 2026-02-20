import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import {
    linkSalesChannelsToStockLocationWorkflow,
    createInventoryLevelsWorkflow,
} from "@medusajs/medusa/core-flows"

export default async function fixStockAvailability({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)
    const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL)

    // Step 1: Get the stock location
    const { data: stockLocations } = await query.graph({
        entity: "stock_location",
        fields: ["id", "name"],
    })

    if (!stockLocations.length) {
        logger.error("No stock locations found!")
        return
    }

    const stockLocation = stockLocations[0]
    logger.info(`Found stock location: ${stockLocation.name} (${stockLocation.id})`)

    // Step 2: Get the sales channel
    const salesChannels = await salesChannelModuleService.listSalesChannels({
        name: "Default Sales Channel",
    })

    if (!salesChannels.length) {
        logger.error("No Default Sales Channel found!")
        return
    }

    const salesChannel = salesChannels[0]
    logger.info(`Found sales channel: ${salesChannel.name} (${salesChannel.id})`)

    // Step 3: Link stock location to sales channel
    logger.info("Linking stock location to sales channel...")
    try {
        await linkSalesChannelsToStockLocationWorkflow(container).run({
            input: {
                id: stockLocation.id,
                add: [salesChannel.id],
            },
        })
        logger.info("✅ Linked stock location to sales channel!")
    } catch (e: any) {
        logger.warn(`Could not link (may already be linked): ${e.message}`)
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
    })

    logger.info(`Found ${products.length} products. Checking inventory...`)

    const { data: inventoryLevels } = await query.graph({
        entity: "inventory_level",
        fields: ["id", "inventory_item_id", "location_id", "stocked_quantity"],
    })

    logger.info(`Found ${inventoryLevels.length} inventory levels`)

    // Step 5: If inventory levels exist at wrong location, update them
    // First get all inventory items
    const { data: inventoryItems } = await query.graph({
        entity: "inventory_item",
        fields: ["id"],
    })

    logger.info(`Found ${inventoryItems.length} inventory items`)

    // Check which inventory items DON'T have levels at our stock location
    const itemsWithLevelAtLocation = new Set(
        inventoryLevels
            .filter((l) => l.location_id === stockLocation.id)
            .map((l) => l.inventory_item_id)
    )

    const itemsWithoutLevel = inventoryItems.filter(
        (item) => !itemsWithLevelAtLocation.has(item.id)
    )

    if (itemsWithoutLevel.length > 0) {
        logger.info(`${itemsWithoutLevel.length} inventory items have no level at the stock location. Creating levels...`)

        const newLevels = itemsWithoutLevel.map((item) => ({
            inventory_item_id: item.id,
            location_id: stockLocation.id,
            stocked_quantity: Math.floor(Math.random() * (1000 - 500 + 1)) + 500,
        }))

        await createInventoryLevelsWorkflow(container).run({
            input: {
                inventory_levels: newLevels,
            },
        })

        logger.info("✅ Created inventory levels for all items!")
    } else {
        logger.info("✅ All inventory items already have levels at the stock location.")
    }

    // Step 6: Print summary
    for (const product of products) {
        for (const variant of product.variants || []) {
            logger.info(
                `  ${product.title} / ${variant.title}: manage_inventory=${variant.manage_inventory}`
            )
        }
    }

    logger.info("Done! Please restart the dev server and check the product page.")
}
