"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = orderPlacedHandler;
const utils_1 = require("@medusajs/framework/utils");
async function orderPlacedHandler({ event: { data }, container, }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const orderId = data.id;
    logger.info(`Order placed subscriber triggered for order: ${orderId}`);
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
        });
        const order = orders[0];
        if (!order) {
            logger.error(`Order ${orderId} not found in subscriber.`);
            return;
        }
        logger.info(`\n========================================`);
        logger.info(`📧 SIMULATED ORDER CONFIRMATION EMAIL`);
        logger.info(`========================================`);
        logger.info(`To: ${order.email}`);
        logger.info(`Subject: Your order #${order.id.slice(-6).toUpperCase()} is successful!`);
        logger.info(`----------------------------------------`);
        logger.info(`Hello ${order.shipping_address?.first_name || 'Customer'},`);
        logger.info(`Thank you for your order! We are processing it.`);
        logger.info(`\nOrder Details:`);
        for (const item of (order.items || [])) {
            if (item) {
                logger.info(`- ${item.title} (x${item.quantity})`);
            }
        }
        logger.info(`\nTotal: ${order.currency_code.toUpperCase()} ${order.total}`);
        logger.info(`----------------------------------------`);
        logger.info(`Success: Notification logged for order ${order.id}`);
        logger.info(`========================================\n`);
        // NOTE: To send REAL emails, you would integrate a notification provider 
        // like SendGrid or Resend here using this data.
    }
    catch (err) {
        logger.error(`Error in order-placed subscriber: ${err.message}`);
        if (err.stack)
            logger.error(err.stack);
    }
}
exports.config = {
    event: "order.placed",
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib3JkZXItcGxhY2VkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3N1YnNjcmliZXJzL29yZGVyLXBsYWNlZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFPQSxxQ0F5REM7QUEzREQscURBQThFO0FBRS9ELEtBQUssVUFBVSxrQkFBa0IsQ0FBQyxFQUMvQyxLQUFLLEVBQUUsRUFBRSxJQUFJLEVBQUUsRUFDZixTQUFTLEdBQ1c7SUFDcEIsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRWhFLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUE7SUFDdkIsTUFBTSxDQUFDLElBQUksQ0FBQyxnREFBZ0QsT0FBTyxFQUFFLENBQUMsQ0FBQTtJQUV0RSxJQUFJLENBQUM7UUFDSCw4RUFBOEU7UUFDOUUsTUFBTSxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7WUFDekMsTUFBTSxFQUFFLE9BQU87WUFDZixNQUFNLEVBQUU7Z0JBQ04sSUFBSTtnQkFDSixPQUFPO2dCQUNQLE9BQU87Z0JBQ1AsZUFBZTtnQkFDZixTQUFTO2dCQUNULG9CQUFvQjthQUNyQjtZQUNELE9BQU8sRUFBRSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUU7U0FDekIsQ0FBQyxDQUFBO1FBRUYsTUFBTSxLQUFLLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3ZCLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztZQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsU0FBUyxPQUFPLDJCQUEyQixDQUFDLENBQUE7WUFDekQsT0FBTTtRQUNSLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxDQUFDLENBQUE7UUFDekQsTUFBTSxDQUFDLElBQUksQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFBO1FBQ3BELE1BQU0sQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQTtRQUN2RCxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7UUFDakMsTUFBTSxDQUFDLElBQUksQ0FBQyx3QkFBd0IsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxXQUFXLEVBQUUsaUJBQWlCLENBQUMsQ0FBQTtRQUN0RixNQUFNLENBQUMsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLENBQUE7UUFDdkQsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLEtBQUssQ0FBQyxnQkFBZ0IsRUFBRSxVQUFVLElBQUksVUFBVSxHQUFHLENBQUMsQ0FBQTtRQUN6RSxNQUFNLENBQUMsSUFBSSxDQUFDLGlEQUFpRCxDQUFDLENBQUE7UUFDOUQsTUFBTSxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFBO1FBQy9CLEtBQUssTUFBTSxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxJQUFJLEVBQUUsQ0FBQyxFQUFFLENBQUM7WUFDdkMsSUFBSSxJQUFJLEVBQUUsQ0FBQztnQkFDVCxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssSUFBSSxDQUFDLEtBQUssTUFBTSxJQUFJLENBQUMsUUFBUSxHQUFHLENBQUMsQ0FBQTtZQUNwRCxDQUFDO1FBQ0gsQ0FBQztRQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsWUFBWSxLQUFLLENBQUMsYUFBYSxDQUFDLFdBQVcsRUFBRSxJQUFJLEtBQUssQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFBO1FBQzNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsMENBQTBDLENBQUMsQ0FBQTtRQUN2RCxNQUFNLENBQUMsSUFBSSxDQUFDLDBDQUEwQyxLQUFLLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQTtRQUNqRSxNQUFNLENBQUMsSUFBSSxDQUFDLDRDQUE0QyxDQUFDLENBQUE7UUFFekQsMEVBQTBFO1FBQzFFLGdEQUFnRDtJQUVsRCxDQUFDO0lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNiLE1BQU0sQ0FBQyxLQUFLLENBQUMscUNBQXFDLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQ2hFLElBQUksR0FBRyxDQUFDLEtBQUs7WUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUN4QyxDQUFDO0FBQ0gsQ0FBQztBQUVZLFFBQUEsTUFBTSxHQUFxQjtJQUN0QyxLQUFLLEVBQUUsY0FBYztDQUN0QixDQUFBIn0=