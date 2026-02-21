"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const utils_1 = require("@medusajs/framework/utils");
// import { IAuthModuleService, ICustomerModuleService } from "@medusajs/types"
async function POST(req, res) {
    const { email, auth_identity_id } = req.body;
    if (!email || !auth_identity_id) {
        return res.status(400).json({ message: "Missing email or auth_identity_id" });
    }
    const customerService = req.scope.resolve(utils_1.Modules.CUSTOMER);
    const authService = req.scope.resolve(utils_1.Modules.AUTH);
    try {
        // 1. Find the existing customer by email
        const [customer] = await customerService.listCustomers({
            email: email,
            // has_account: true // Optional, depending on need
        });
        if (!customer) {
            return res.status(404).json({ message: "Customer not found to link" });
        }
        // 2. Link the auth identity to this customer
        console.log(`Linking AuthIdentity ${auth_identity_id} to Customer ${customer.id}`);
        // Retrieve first to presume existing metadata
        const existing = await authService.retrieveAuthIdentity(auth_identity_id).catch(() => null);
        const existingMetadata = existing?.app_metadata || {};
        console.log("AuthIdentity BEFORE:", JSON.stringify(existing));
        const updated = await authService.updateAuthIdentities([{
                id: auth_identity_id,
                app_metadata: {
                    ...existingMetadata,
                    customer_id: customer.id,
                    // We can also set actor_type for clarity, though backend likely uses customer_id
                    actor_type: "customer"
                }
            }]);
        console.log("Update Result:", JSON.stringify(updated));
        const after = await authService.retrieveAuthIdentity(auth_identity_id).catch(() => null);
        console.log("AuthIdentity AFTER:", JSON.stringify(after));
        return res.status(200).json({
            success: true,
            message: "Account linked successfully",
            customer_id: customer.id,
            debug_before: existing,
            debug_after: after
        });
    }
    catch (error) {
        console.error("Linking error:", error);
        return res.status(500).json({ message: "Failed to link account", error: error.message });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2N1c3RvbS1hdXRoL2xpbmsvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxvQkEyREM7QUE5REQscURBQW1EO0FBQ25ELCtFQUErRTtBQUV4RSxLQUFLLFVBQVUsSUFBSSxDQUN4QixHQUFrQixFQUNsQixHQUFtQjtJQUVuQixNQUFNLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLEdBQUcsR0FBRyxDQUFDLElBQVcsQ0FBQTtJQUVuRCxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUNoQyxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLG1DQUFtQyxFQUFFLENBQUMsQ0FBQTtJQUMvRSxDQUFDO0lBRUQsTUFBTSxlQUFlLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBQzNELE1BQU0sV0FBVyxHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLGVBQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQTtJQUVuRCxJQUFJLENBQUM7UUFDSCx5Q0FBeUM7UUFDekMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxHQUFHLE1BQU0sZUFBZSxDQUFDLGFBQWEsQ0FBQztZQUNyRCxLQUFLLEVBQUUsS0FBSztZQUNaLG1EQUFtRDtTQUNwRCxDQUFDLENBQUE7UUFFRixJQUFJLENBQUMsUUFBUSxFQUFFLENBQUM7WUFDZCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLENBQUMsQ0FBQTtRQUN4RSxDQUFDO1FBRUQsNkNBQTZDO1FBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsd0JBQXdCLGdCQUFnQixnQkFBZ0IsUUFBUSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUE7UUFFbEYsOENBQThDO1FBQzlDLE1BQU0sUUFBUSxHQUFHLE1BQU0sV0FBVyxDQUFDLG9CQUFvQixDQUFDLGdCQUFnQixDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFBO1FBQzNGLE1BQU0sZ0JBQWdCLEdBQUcsUUFBUSxFQUFFLFlBQVksSUFBSSxFQUFFLENBQUE7UUFFckQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUE7UUFFN0QsTUFBTSxPQUFPLEdBQUcsTUFBTSxXQUFXLENBQUMsb0JBQW9CLENBQUMsQ0FBQztnQkFDcEQsRUFBRSxFQUFFLGdCQUFnQjtnQkFDcEIsWUFBWSxFQUFFO29CQUNWLEdBQUcsZ0JBQWdCO29CQUNuQixXQUFXLEVBQUUsUUFBUSxDQUFDLEVBQUU7b0JBQ3hCLGlGQUFpRjtvQkFDakYsVUFBVSxFQUFFLFVBQVU7aUJBQ3pCO2FBQ0osQ0FBQyxDQUFDLENBQUE7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLGdCQUFnQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQTtRQUV0RCxNQUFNLEtBQUssR0FBRyxNQUFNLFdBQVcsQ0FBQyxvQkFBb0IsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQTtRQUN4RixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQTtRQUV6RCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQ3hCLE9BQU8sRUFBRSxJQUFJO1lBQ2IsT0FBTyxFQUFFLDZCQUE2QjtZQUN0QyxXQUFXLEVBQUUsUUFBUSxDQUFDLEVBQUU7WUFDeEIsWUFBWSxFQUFFLFFBQVE7WUFDdEIsV0FBVyxFQUFFLEtBQUs7U0FDckIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7UUFDZixPQUFPLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLEtBQUssQ0FBQyxDQUFBO1FBQ3RDLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsS0FBSyxFQUFFLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO0lBQzFGLENBQUM7QUFDSCxDQUFDIn0=