
import {
  type SubscriberConfig,
  type SubscriberArgs,
} from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<any>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const orderId = data.id
  logger.info(`Order placed subscriber triggered for order: ${orderId}`)

  try {
    // In Medusa v2, we use the query engine to fetch order details with relations
    const { data: orders } = await query.graph({
      entity: "order",
      fields: [
        "id",
        "email",
        "total",
        "currency_code",
        "items.*",
        "shipping_address.*"
      ],
      filters: { id: orderId }
    })

    const order = orders[0]
    if (!order) {
      logger.error(`Order ${orderId} not found in subscriber.`)
      return
    }

    logger.info(`\n========================================`)
    logger.info(`📧 SIMULATED ORDER CONFIRMATION EMAIL`)
    logger.info(`========================================`)
    logger.info(`To: ${order.email}`)
    logger.info(`Subject: Your order #${order.id.slice(-6).toUpperCase()} is successful!`)
    logger.info(`----------------------------------------`)
    logger.info(`Hello ${order.shipping_address?.first_name || 'Customer'},`)
    logger.info(`Thank you for your order! We are processing it.`)
    logger.info(`\nOrder Details:`)
    for (const item of (order.items || [])) {
      if (item) {
        logger.info(`- ${item.title} (x${item.quantity})`)
      }
    }
    logger.info(`\nTotal: ${order.currency_code.toUpperCase()} ${order.total}`)
    logger.info(`----------------------------------------`)
    logger.info(`Success: Notification logged for order ${order.id}`)
    logger.info(`========================================\n`)

    // NOTE: To send REAL emails, you would integrate a notification provider 
    // like SendGrid or Resend here using this data.

  } catch (err) {
    logger.error(`Error in order-placed subscriber: ${err.message}`)
    if (err.stack) logger.error(err.stack)
  }
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
