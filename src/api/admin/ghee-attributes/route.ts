import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { UpdateGheeAttributesRequest, GheeAttributesResponse } from "../../../types/ghee-types"

/**
 * GET /admin/ghee-attributes
 * Retrieve ghee-specific metadata for a product
 */
export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { productId } = req.query

  if (!productId || typeof productId !== 'string') {
    return res.status(400).json({
      message: "Missing or invalid productId query parameter"
    })
  }

  try {
    const productModuleService = req.scope.resolve(Modules.PRODUCT)
    
    const product = await productModuleService.retrieveProduct(productId, {
      select: ["id", "title", "metadata"]
    })

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      })
    }

    return res.status(200).json({
      productId: product.id,
      metadata: product.metadata || {}
    })
  } catch (error) {
    console.error("Error fetching ghee attributes:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    })
  }
}

/**
 * POST /admin/ghee-attributes
 * Add or update ghee-specific metadata for a product
 */
export async function POST(
  req: MedusaRequest<UpdateGheeAttributesRequest>,
  res: MedusaResponse<GheeAttributesResponse>
) {
  const { productId, metadata } = req.body

  if (!productId || !metadata) {
    return res.status(400).json({
      message: "Missing productId or metadata in request body"
    } as any)
  }

  try {
    const productModuleService = req.scope.resolve(Modules.PRODUCT)
    
    // Get existing product
    const product = await productModuleService.retrieveProduct(productId, {
      select: ["id", "metadata"]
    })

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      } as any)
    }

    // Merge new metadata with existing
    const updatedMetadata = {
      ...product.metadata,
      ...metadata
    }

    // Update product
    await productModuleService.updateProducts(productId, {
      metadata: updatedMetadata
    })

    return res.status(200).json({
      productId,
      metadata: updatedMetadata,
      updated: true
    })
  } catch (error) {
    console.error("Error updating ghee attributes:", error)
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    } as any)
  }
}
