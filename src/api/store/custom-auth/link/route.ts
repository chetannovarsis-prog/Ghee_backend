import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
// import { IAuthModuleService, ICustomerModuleService } from "@medusajs/types"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { email, auth_identity_id } = req.body as any
  
  if (!email || !auth_identity_id) {
    return res.status(400).json({ message: "Missing email or auth_identity_id" })
  }

  const customerService = req.scope.resolve(Modules.CUSTOMER)
  const authService = req.scope.resolve(Modules.AUTH)

  try {
    // 1. Find the existing customer by email
    const [customer] = await customerService.listCustomers({ 
      email: email,
      // has_account: true // Optional, depending on need
    })

    if (!customer) {
      return res.status(404).json({ message: "Customer not found to link" })
    }

    // 2. Link the auth identity to this customer
    console.log(`Linking AuthIdentity ${auth_identity_id} to Customer ${customer.id}`)
    
    // Retrieve first to presume existing metadata
    const existing = await authService.retrieveAuthIdentity(auth_identity_id).catch(() => null)
    const existingMetadata = existing?.app_metadata || {}

    console.log("AuthIdentity BEFORE:", JSON.stringify(existing))

    const updated = await authService.updateAuthIdentities([{
        id: auth_identity_id,
        app_metadata: {
            ...existingMetadata,
            customer_id: customer.id,
            // We can also set actor_type for clarity, though backend likely uses customer_id
            actor_type: "customer" 
        }
    }])
    
    console.log("Update Result:", JSON.stringify(updated))

    const after = await authService.retrieveAuthIdentity(auth_identity_id).catch(() => null)
    console.log("AuthIdentity AFTER:", JSON.stringify(after))

    return res.status(200).json({ 
        success: true, 
        message: "Account linked successfully",
        customer_id: customer.id,
        debug_before: existing,
        debug_after: after
    })
  } catch (error) {
    console.error("Linking error:", error)
    return res.status(500).json({ message: "Failed to link account", error: error.message })
  }
}
