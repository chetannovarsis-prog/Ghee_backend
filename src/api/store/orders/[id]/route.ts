import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"

/**
 * POST /store/orders/:id
 * Saves the UTR number and payment status to the order's metadata.
 * Called by the storefront after a customer submits their UPI reference/UTR.
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
    const { id } = req.params
    const { metadata } = req.body as { metadata?: Record<string, string> }

    if (!metadata) {
        return res.status(400).json({ message: "metadata is required" })
    }

    try {
        const orderModule = req.scope.resolve(Modules.ORDER)

        // Fetch current order to merge metadata
        const [order] = await orderModule.listOrders({ id }, { select: ["id", "metadata"] })

        if (!order) {
            return res.status(404).json({ message: `Order ${id} not found` })
        }

        // Merge with existing metadata
        const updatedMetadata = { ...(order.metadata || {}), ...metadata }

        await orderModule.updateOrders(id, { metadata: updatedMetadata })

        return res.json({
            order: { id, metadata: updatedMetadata },
            message: "Payment reference submitted successfully."
        })
    } catch (err: any) {
        console.error("[UTR submit] Error updating order metadata:", err.message)
        return res.status(500).json({ message: err.message })
    }
}
