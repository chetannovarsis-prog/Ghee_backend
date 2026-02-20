import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { email, otp } = req.body as { email: string, otp: string }

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" })
  }

  const cacheService = req.scope.resolve("cacheService") as any
  const storedOtp = await cacheService.get(`otp_${email}`)

  if (storedOtp === otp) {
    // Verify success - in a real app, you might generate a temporary token 
    // to authorize the actual password update.
    // For now, we'll just return success.
    res.status(200).json({ message: "OTP verified", success: true })
  } else {
    res.status(400).json({ message: "Invalid OTP", success: false })
  }
}
