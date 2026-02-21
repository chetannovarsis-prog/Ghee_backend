"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GET = GET;
exports.POST = POST;
const utils_1 = require("@medusajs/framework/utils");
/**
 * GET /admin/ghee-attributes
 * Retrieve ghee-specific metadata for a product
 */
async function GET(req, res) {
    const { productId } = req.query;
    if (!productId || typeof productId !== 'string') {
        return res.status(400).json({
            message: "Missing or invalid productId query parameter"
        });
    }
    try {
        const productModuleService = req.scope.resolve(utils_1.Modules.PRODUCT);
        const product = await productModuleService.retrieveProduct(productId, {
            select: ["id", "title", "metadata"]
        });
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        return res.status(200).json({
            productId: product.id,
            metadata: product.metadata || {}
        });
    }
    catch (error) {
        console.error("Error fetching ghee attributes:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
/**
 * POST /admin/ghee-attributes
 * Add or update ghee-specific metadata for a product
 */
async function POST(req, res) {
    const { productId, metadata } = req.body;
    if (!productId || !metadata) {
        return res.status(400).json({
            message: "Missing productId or metadata in request body"
        });
    }
    try {
        const productModuleService = req.scope.resolve(utils_1.Modules.PRODUCT);
        // Get existing product
        const product = await productModuleService.retrieveProduct(productId, {
            select: ["id", "metadata"]
        });
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        // Merge new metadata with existing
        const updatedMetadata = {
            ...product.metadata,
            ...metadata
        };
        // Update product
        await productModuleService.updateProducts(productId, {
            metadata: updatedMetadata
        });
        return res.status(200).json({
            productId,
            metadata: updatedMetadata,
            updated: true
        });
    }
    catch (error) {
        console.error("Error updating ghee attributes:", error);
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL2doZWUtYXR0cmlidXRlcy9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQVFBLGtCQW9DQztBQU1ELG9CQWlEQztBQWxHRCxxREFBbUQ7QUFHbkQ7OztHQUdHO0FBQ0ksS0FBSyxVQUFVLEdBQUcsQ0FDdkIsR0FBa0IsRUFDbEIsR0FBbUI7SUFFbkIsTUFBTSxFQUFFLFNBQVMsRUFBRSxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUE7SUFFL0IsSUFBSSxDQUFDLFNBQVMsSUFBSSxPQUFPLFNBQVMsS0FBSyxRQUFRLEVBQUUsQ0FBQztRQUNoRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSw4Q0FBOEM7U0FDeEQsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELElBQUksQ0FBQztRQUNILE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRS9ELE1BQU0sT0FBTyxHQUFHLE1BQU0sb0JBQW9CLENBQUMsZUFBZSxDQUFDLFNBQVMsRUFBRTtZQUNwRSxNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFVBQVUsQ0FBQztTQUNwQyxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDYixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsbUJBQW1CO2FBQzdCLENBQUMsQ0FBQTtRQUNKLENBQUM7UUFFRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLFNBQVMsRUFBRSxPQUFPLENBQUMsRUFBRTtZQUNyQixRQUFRLEVBQUUsT0FBTyxDQUFDLFFBQVEsSUFBSSxFQUFFO1NBQ2pDLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN2RCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPO1NBQ3JCLENBQUMsQ0FBQTtJQUNKLENBQUM7QUFDSCxDQUFDO0FBRUQ7OztHQUdHO0FBQ0ksS0FBSyxVQUFVLElBQUksQ0FDeEIsR0FBK0MsRUFDL0MsR0FBMkM7SUFFM0MsTUFBTSxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFBO0lBRXhDLElBQUksQ0FBQyxTQUFTLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM1QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSwrQ0FBK0M7U0FDbEQsQ0FBQyxDQUFBO0lBQ1gsQ0FBQztJQUVELElBQUksQ0FBQztRQUNILE1BQU0sb0JBQW9CLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1FBRS9ELHVCQUF1QjtRQUN2QixNQUFNLE9BQU8sR0FBRyxNQUFNLG9CQUFvQixDQUFDLGVBQWUsQ0FBQyxTQUFTLEVBQUU7WUFDcEUsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLFVBQVUsQ0FBQztTQUMzQixDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsT0FBTyxFQUFFLENBQUM7WUFDYixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUMxQixPQUFPLEVBQUUsbUJBQW1CO2FBQ3RCLENBQUMsQ0FBQTtRQUNYLENBQUM7UUFFRCxtQ0FBbUM7UUFDbkMsTUFBTSxlQUFlLEdBQUc7WUFDdEIsR0FBRyxPQUFPLENBQUMsUUFBUTtZQUNuQixHQUFHLFFBQVE7U0FDWixDQUFBO1FBRUQsaUJBQWlCO1FBQ2pCLE1BQU0sb0JBQW9CLENBQUMsY0FBYyxDQUFDLFNBQVMsRUFBRTtZQUNuRCxRQUFRLEVBQUUsZUFBZTtTQUMxQixDQUFDLENBQUE7UUFFRixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLFNBQVM7WUFDVCxRQUFRLEVBQUUsZUFBZTtZQUN6QixPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsT0FBTyxDQUFDLEtBQUssQ0FBQyxpQ0FBaUMsRUFBRSxLQUFLLENBQUMsQ0FBQTtRQUN2RCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSx1QkFBdUI7WUFDaEMsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPO1NBQ2QsQ0FBQyxDQUFBO0lBQ1gsQ0FBQztBQUNILENBQUMifQ==