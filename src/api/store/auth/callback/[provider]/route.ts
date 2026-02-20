import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { provider } = req.params
  
  // This is a generic auth callback route if needed
  // But usually @medusajs/auth handles its own internal routes /auth/:provider
  
  res.status(200).json({ message: "Auth callback" })
}
