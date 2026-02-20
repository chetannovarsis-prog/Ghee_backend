import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"

export default async function checkApiKeyLinks({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: apiKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "title", "token", "sales_channels.name", "sales_channels.id"],
    filters: {
      type: ["publishable"]
    }
  })

  logger.info(`Found ${apiKeys.length} publishable API keys:`)
  console.table(apiKeys.map(k => ({
    id: k.id,
    title: k.title,
    channels: k.sales_channels?.map(sc => sc!.name).join(", ")
  })))

  // Also log the first token for comparison with storefront .env
  if (apiKeys.length > 0) {
    logger.info(`First API Key Token: ${apiKeys[0].token}`)
  }
}
