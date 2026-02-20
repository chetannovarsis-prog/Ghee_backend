import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import * as fs from "fs"

export default async function checkProductsInventory({ container }: ExecArgs) {
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
    const query = container.resolve(ContainerRegistrationKeys.QUERY)

    const { data: productsSafe } = await query.graph({
        entity: "product",
        fields: [
            "title",
            "categories.name",
            "variants.title",
            "variants.id"
        ]
    })

    const variantIds = productsSafe.flatMap(p => p.variants.map(v => v.id))

    const { data: variantInventoryItems } = await query.graph({
        entity: "product_variant_inventory_item",
        fields: ["variant_id", "inventory_item_id"],
        filters: {
            variant_id: variantIds
        }
    })

    // inventory_item_id could be undefined if no link exists
    const inventoryItemIds = variantInventoryItems.map(i => i.inventory_item_id).filter(Boolean)

    const { data: inventoryLevels } = await query.graph({
        entity: "inventory_level",
        fields: ["inventory_item_id", "stocked_quantity"],
        filters: {
            inventory_item_id: inventoryItemIds
        }
    })

    const report = productsSafe.flatMap(p => p.variants.map(v => {
        const link = variantInventoryItems.find(i => i.variant_id === v.id)
        const level = link ? inventoryLevels.find(l => l.inventory_item_id === link.inventory_item_id) : null
        return `Product: ${p.title} | Category: ${p.categories?.map(c => c.name).join(", ")} | Variant: ${v.title} | Stock: ${level ? level.stocked_quantity : "N/A"}`
    })).join("\n")

    console.log(report)
    fs.writeFileSync("inventory-report.txt", report)
    logger.info("Written to inventory-report.txt")
}
