"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
console.log("Loading Razorpay Service file");
const utils_1 = require("@medusajs/framework/utils");
const razorpay_1 = __importDefault(require("razorpay"));
class RazorpayProviderService extends utils_1.AbstractPaymentProvider {
    constructor(container, options) {
        super(container, options);
        this.logger_ = container.logger;
        this.razorpay_ = new razorpay_1.default({
            key_id: options.key_id,
            key_secret: options.key_secret,
        });
    }
    getPaymentMethods() {
        return [
            {
                id: "razorpay",
                label: "UPI / Credit / Debit / ATM Card (Razorpay)",
            },
        ];
    }
    async capturePayment(input) {
        return {
            data: input.data
        };
    }
    async authorizePayment(input) {
        return {
            status: "authorized",
            data: input.data
        };
    }
    async cancelPayment(input) {
        return {
            data: input.data
        };
    }
    async initiatePayment(input) {
        const { amount, currency_code } = input;
        try {
            const order = await this.razorpay_.orders.create({
                amount: Math.round(Number(amount) * 100), // Razorpay expected amount in paise
                currency: currency_code.toUpperCase(),
                receipt: `order_${Date.now()}`,
            });
            return {
                id: order.id,
                data: {
                    ...order,
                }
            };
        }
        catch (error) {
            this.logger_.error(`Error initiating Razorpay payment: ${error.message}`);
            throw error;
        }
    }
    async deletePayment(input) {
        return {
            data: input.data
        };
    }
    async getPaymentStatus(input) {
        const { data } = input;
        const orderId = data.id;
        try {
            const order = await this.razorpay_.orders.fetch(orderId);
            if (order.status === "paid") {
                return { status: "captured" };
            }
            return { status: "pending" };
        }
        catch (error) {
            return { status: "error" };
        }
    }
    async refundPayment(input) {
        return {
            data: input.data
        };
    }
    async retrievePayment(input) {
        return (input.data || {});
    }
    async updatePayment(input) {
        return {
            data: {
                ...(input.data || {}),
            }
        };
    }
    async getWebhookActionAndData(payload) {
        return {
            action: "not_supported",
            data: {
                session_id: "",
                amount: new utils_1.BigNumber(0)
            }
        };
    }
}
RazorpayProviderService.identifier = "razorpay-copy";
exports.default = RazorpayProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Jhem9ycGF5LWNvcHkvc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7OztBQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUM1QyxxREFBOEU7QUE0QjlFLHdEQUErQjtBQU8vQixNQUFNLHVCQUF3QixTQUFRLCtCQUF3QztJQUs1RSxZQUFZLFNBQTZCLEVBQUUsT0FBd0I7UUFDakUsS0FBSyxDQUFDLFNBQVMsRUFBRSxPQUFPLENBQUMsQ0FBQTtRQUN6QixJQUFJLENBQUMsT0FBTyxHQUFHLFNBQVMsQ0FBQyxNQUFNLENBQUE7UUFDL0IsSUFBSSxDQUFDLFNBQVMsR0FBRyxJQUFJLGtCQUFRLENBQUM7WUFDNUIsTUFBTSxFQUFFLE9BQU8sQ0FBQyxNQUFNO1lBQ3RCLFVBQVUsRUFBRSxPQUFPLENBQUMsVUFBVTtTQUMvQixDQUFDLENBQUE7SUFDSixDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsT0FBTztZQUNMO2dCQUNFLEVBQUUsRUFBRSxVQUFVO2dCQUNkLEtBQUssRUFBRSw0Q0FBNEM7YUFDcEQ7U0FDRixDQUFBO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBMEI7UUFDN0MsT0FBTztZQUNMLElBQUksRUFBRSxLQUFLLENBQUMsSUFBSTtTQUNqQixDQUFBO0lBQ0gsQ0FBQztJQUVELEtBQUssQ0FBQyxnQkFBZ0IsQ0FBQyxLQUE0QjtRQUNqRCxPQUFPO1lBQ0wsTUFBTSxFQUFFLFlBQVk7WUFDcEIsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1NBQ2pCLENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUF5QjtRQUMzQyxPQUFPO1lBQ0wsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJO1NBQ2pCLENBQUE7SUFDSCxDQUFDO0lBRUQsS0FBSyxDQUFD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