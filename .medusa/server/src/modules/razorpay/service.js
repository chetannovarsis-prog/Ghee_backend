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
        const { data } = input;
        console.log(`[Razorpay] Capture Payment Input Data:`, JSON.stringify(data, null, 2));
        let paymentId = data.razorpay_payment_id;
        // Fallback: If paymentId is missing, try to find it from the order_id
        if (!paymentId && data.id) {
            console.log(`[Razorpay] Missing payment ID, attempting to fetch from order: ${data.id}`);
            try {
                const payments = await this.razorpay_.orders.fetchPayments(data.id);
                if (payments && payments.items && payments.items.length > 0) {
                    // Find the latest authorized or captured payment
                    const validPayment = payments.items.find((p) => p.status === "authorized" || p.status === "captured");
                    if (validPayment) {
                        paymentId = validPayment.id;
                        console.log(`[Razorpay] Found payment ID from order: ${paymentId}`);
                    }
                }
            }
            catch (err) {
                console.error(`[Razorpay] Failed to fetch payments for order:`, err);
            }
        }
        console.log(`[Razorpay] Capturing payment: ${paymentId}`);
        if (!paymentId) {
            console.error("[Razorpay] No payment ID found for capture");
            throw new Error("Payment ID is required to capture payment. Please ensure the payment was successful on the customer side.");
        }
        try {
            // Razorpay automatically captures payments when customer completes payment
            // We just need to fetch the payment to verify it's captured
            const payment = await this.razorpay_.payments.fetch(paymentId);
            console.log(`[Razorpay] Payment status: ${payment.status}, captured: ${payment.captured}`);
            // If payment is not captured, capture it
            if (!payment.captured && payment.status === "authorized") {
                const capturedPayment = await this.razorpay_.payments.capture(paymentId, payment.amount, payment.currency);
                console.log(`[Razorpay] Payment captured successfully: ${capturedPayment.id}`);
                return {
                    data: {
                        ...data,
                        ...capturedPayment,
                        razorpay_payment_id: paymentId,
                        razorpay_payment_captured: true
                    }
                };
            }
            return {
                data: {
                    ...data,
                    ...payment,
                    razorpay_payment_id: paymentId,
                    razorpay_payment_captured: payment.captured
                }
            };
        }
        catch (error) {
            console.error(`[Razorpay] Error capturing payment:`, error);
            this.logger_.error(`Error capturing Razorpay payment: ${error.message}`);
            throw error;
        }
    }
    async authorizePayment(input) {
        const { data } = input;
        let paymentId = data.razorpay_payment_id;
        // Fallback: If paymentId is missing, try to find it from the order_id
        if (!paymentId && data.id) {
            console.log(`[Razorpay] Authorize: Missing payment ID, attempting to fetch from order: ${data.id}`);
            try {
                const payments = await this.razorpay_.orders.fetchPayments(data.id);
                if (payments && payments.items && payments.items.length > 0) {
                    const validPayment = payments.items.find((p) => p.status === "authorized" || p.status === "captured");
                    if (validPayment) {
                        paymentId = validPayment.id;
                        console.log(`[Razorpay] Authorize: Found payment ID from order: ${paymentId}`);
                    }
                }
            }
            catch (err) {
                console.error(`[Razorpay] Authorize: Failed to fetch payments for order:`, err);
            }
        }
        console.log(`[Razorpay] Authorizing payment: ${paymentId}`);
        if (!paymentId) {
            console.log("[Razorpay] No payment ID found, returning authorized status with existing data");
            return {
                status: "authorized",
                data: data
            };
        }
        try {
            // Fetch payment details from Razorpay
            const payment = await this.razorpay_.payments.fetch(paymentId);
            console.log(`[Razorpay] Payment fetched - Status: ${payment.status}, Captured: ${payment.captured}`);
            return {
                status: payment.captured ? "captured" : "authorized",
                data: {
                    ...data,
                    ...payment,
                    razorpay_payment_id: paymentId,
                    razorpay_payment_status: payment.status,
                    razorpay_payment_captured: payment.captured
                }
            };
        }
        catch (error) {
            console.error(`[Razorpay] Error authorizing payment:`, error);
            this.logger_.error(`Error authorizing Razorpay payment: ${error.message}`);
            return {
                status: "authorized",
                data: {
                    ...data,
                    razorpay_payment_id: paymentId
                }
            };
        }
    }
    async cancelPayment(input) {
        return {
            data: input.data
        };
    }
    async initiatePayment(input) {
        const { amount, currency_code } = input;
        console.log(`[Razorpay] Initiating payment for amount: ${amount} ${currency_code}`);
        try {
            // In Medusa v2, amount is typically in major units if configured so, 
            // but Razorpay EXPECTS minor units (paise for INR).
            // We'll multiply by 100 to ensure we send paise.
            const razorAmount = Math.round(Number(amount) * 100);
            console.log(`[Razorpay] Creating order with amount: ${razorAmount} ${currency_code.toUpperCase()}`);
            const order = await this.razorpay_.orders.create({
                amount: razorAmount,
                currency: currency_code.toUpperCase(),
                receipt: `order_${Date.now()}`,
            });
            console.log(`[Razorpay] Order created successfully: ${order.id}`);
            return {
                id: order.id,
                data: {
                    ...order,
                }
            };
        }
        catch (error) {
            console.error(`[Razorpay] Error initiating Razorpay payment:`, error);
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
        console.log(`[Razorpay] Update Payment Input Data:`, JSON.stringify(input.data, null, 2));
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
RazorpayProviderService.identifier = "razorpay";
exports.default = RazorpayProviderService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3Jhem9ycGF5L3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLENBQUMsR0FBRyxDQUFDLCtCQUErQixDQUFDLENBQUE7QUFDNUMscURBQThFO0FBd0I5RSx3REFBK0I7QUFPL0IsTUFBTSx1QkFBd0IsU0FBUSwrQkFBd0M7SUFLNUUsWUFBWSxTQUE2QixFQUFFLE9BQXdCO1FBQ2pFLEtBQUssQ0FBQyxTQUFTLEVBQUUsT0FBTyxDQUFDLENBQUE7UUFDekIsSUFBSSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsTUFBTSxDQUFBO1FBQy9CLElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxrQkFBUSxDQUFDO1lBQzVCLE1BQU0sRUFBRSxPQUFPLENBQUMsTUFBTTtZQUN0QixVQUFVLEVBQUUsT0FBTyxDQUFDLFVBQVU7U0FDL0IsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELGlCQUFpQjtRQUNmLE9BQU87WUFDTDtnQkFDRSxFQUFFLEVBQUUsVUFBVTtnQkFDZCxLQUFLLEVBQUUsNENBQTRDO2FBQ3BEO1NBQ0YsQ0FBQTtJQUNILENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQTBCO1FBQzdDLE1BQU0sRUFBRSxJQUFJLEVBQUUsR0FBRyxLQUFLLENBQUE7UUFDdEIsT0FBTyxDQUFDLEdBQUcsQ0FBQyx3Q0FBd0MsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtRQUVwRixJQUFJLFNBQVMsR0FBSSxJQUFZLENBQUMsbUJBQW1CLENBQUE7UUFFakQsc0VBQXNFO1FBQ3RFLElBQUksQ0FBQyxTQUFTLElBQUssSUFBWSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ25DLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0VBQW1FLElBQVksQ0FBQyxF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