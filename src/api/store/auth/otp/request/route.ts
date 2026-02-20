import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const { email } = req.body as { email: string }

  if (!email) {
    return res.status(400).json({ message: "Email is required" })
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()

  // Store OTP in cache with 10-minute expiry
  // Using Medusa's cache service if available, or just a temporary store
  const cacheService = req.scope.resolve("cacheService") as any
  await cacheService.set(`otp_${email}`, otp, 600)

  console.log(`[OTP] Generated for ${email}: ${otp}`)

  // In a real app, send email here
  // For now, we simulate sending to ansupal001@gmail.com
  // if (email === "ansupal001@gmail.com") { ... }

  res.status(200).json({ message: "OTP sent successfully" })
}
