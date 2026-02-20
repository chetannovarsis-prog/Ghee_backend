import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function addRazorpayToRegion({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const paymentModuleService = container.resolve(Modules.PAYMENT)

  // List all payment providers
  const providers = await paymentModuleService.listPaymentProviders(
    { is_enabled: true },
    { take: 50 }
  )
  logger.info(`All registered payment providers: ${(providers as any[]).map((p: any) => p.id).join(", ")}`)

  // Get India region
  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "currency_code"],
  })
  const indiaRegion = (regions as any[]).find(
    (r: any) => r.name === "India" || r.currency_code === "inr"
  )
  if (!indiaRegion) { logger.error("India region not found!"); return }
  logger.info(`India region: ${indiaRegion.id}`)

  // Find Razorpay provider
  const razorpayProvider = (providers as any[]).find(
    (p: any) => p.id.includes("razorpay")
  )
  if (!razorpayProvider) {
    logger.error("Razorpay NOT registered! Available: " + (providers as any[]).map((p: any) => p.id).join(", "))
    return
  }
  logger.info(`Razorpay provider ID: ${razorpayProvider.id}`)

  // In Medusa v2, the link between payment_provider and region
  // is stored in the `region_payment_provider` table.
  // We must use the RemoteLink service to create this link.
  const remoteLink = container.resolve(ContainerRegistrationKeys.LINK)
  
  try {
    await remoteLink.create([
      {
        [Modules.REGION]: {
          region_id: indiaRegion.id,
        },
        [Modules.PAYMENT]: {
          payment_provider_id: razorpayProvider.id,
        },
      }
    ])
    logger.info(`✅ Linked ${razorpayProvider.id} to India region via RemoteLink!`)
  } catch (e: any) {
    if (e.message?.includes("duplicate") || e.message?.includes("already exists")) {
      logger.info("Link already exists, that's fine!")
    } else {
      logger.error(`Link creation failed: ${e.message}`)
    }
  }

  // Verify via store API query
  const { data: regionPaymentProviders } = await query.graph({
    entity: "region",
    fields: ["id", "name", "payment_providers.*"],
    filters: { id: [indiaRegion.id] },
  })
  logger.info(`India region payment providers: ${JSON.stringify((regionPaymentProviders as any[])[0]?.payment_providers?.map((p: any) => p.id))}`)
}
