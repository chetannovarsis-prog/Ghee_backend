import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

/**
 * POST /store/orders/:id
 * Saves the UTR / UPI reference number to the order's metadata.
 * Called by the storefront after a customer submits their payment reference.
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params
    const { metadata } = req.body as { metadata?: Record<string, string> }

    if (!metadata) {
        return res.status(400).json({ message: "metadata is required" })
    }

    try {
        const orderModule = req.scope.resolve(Modules.ORDER)

        // Fetch the current order so we can safely merge metadata
        const orders = await orderModule.listOrders(
            { id: [id] },  // filter by id array (Medusa v2 style)
            { take: 1 }
        )

        const order = orders?.[0]
        if (!order) {
            return res.status(404).json({ message: `Order '${id}' not found.` })
        }

        // Merge new metadata with existing
        const updatedMetadata = {
            ...(order.metadata || {}),
            ...metadata,
            metadata_updated_at: new Date().toISOString(),
        }

        // Update via module service  
        await orderModule.updateOrders([{
            id,
            metadata: updatedMetadata,
        }])

        return res.json({
            success: true,
            order: { id, metadata: updatedMetadata },
            message: "Payment reference submitted successfully.",
        })
    } catch (err: any) {
        console.error("[UTR submit] Error:", err.message, err.stack)
        return res.status(500).json({ message: err.message || "Failed to save payment reference." })
    }
}
