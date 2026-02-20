import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { email, otp, newPassword } = req.body as { email: string, otp: string, newPassword: string }

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Email, OTP, and new password are required" })
  }

  const cacheService = req.scope.resolve("cacheService") as any
  const storedOtp = await cacheService.get(`otp_${email}`)

  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid or expired OTP" })
  }

  // OTP is valid, proceed to update password
  const customerModuleService = req.scope.resolve("customerModuleService") as any
  
  try {
    const customers = await customerModuleService.list({ email })
    if (customers.length === 0) {
      return res.status(404).json({ message: "Customer not found" })
    }

    await customerModuleService.update(customers[0].id, {
      password: newPassword
    })

    // Clear OTP after success
    await cacheService.delete(`otp_${email}`)

    res.status(200).json({ message: "Password updated successfully" })
  } catch (error: any) {
    res.status(500).json({ message: error.message || "Failed to update password" })
  }
}
