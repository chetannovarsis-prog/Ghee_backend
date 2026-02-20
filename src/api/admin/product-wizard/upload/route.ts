import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { imageToProductWizardWorkflow } from "../../../../workflows/image-to-product-wizard"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  // We expect multipart/form-data or json with base64 for simplicity in this MVP
  // If it's multipart, we'd need to parse it using something like busboy or multer
  // For now, let's assume JSON with base64 for the first pass to avoid adding heavy dependencies
  
  const { filename, fileContent } = req.body as any

  if (!filename || !fileContent) {
    return res.status(400).json({
      message: "Missing filename or fileContent (base64)"
    })
  }

  try {
    const { result } = await imageToProductWizardWorkflow(req.scope)
      .run({
        input: {
          filename,
          fileContent
        },
      })

    res.status(200).json(result)
  } catch (error) {
    console.error("Workflow failed:", error)
    res.status(500).json({
      message: "Internal server error during image discovery",
      error: error.message
    })
  }
}
