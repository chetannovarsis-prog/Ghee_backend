console.log("Loading Razorpay Service file")
import { AbstractPaymentProvider, BigNumber } from "@medusajs/framework/utils"
import {
  Logger,
  CapturePaymentInput,
  CapturePaymentOutput,
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  ProviderWebhookPayload,
  WebhookActionResult
} from "@medusajs/framework/types"
import Razorpay from "razorpay"

type RazorpayOptions = {
  key_id: string
  key_secret: string
}

class RazorpayProviderService extends AbstractPaymentProvider<RazorpayOptions> {
  static identifier = "razorpay"
  protected logger_: Logger
  protected razorpay_: Razorpay

  constructor(container: { logger: Logger }, options: RazorpayOptions) {
    super(container, options)
    this.logger_ = container.logger
    this.razorpay_ = new Razorpay({
      key_id: options.key_id,
      key_secret: options.key_secret,
    })
  }

  getPaymentMethods() {
    return [
      {
        id: "razorpay",
        label: "UPI / Credit / Debit / ATM Card (Razorpay)",
      },
    ]
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    const { data } = input
    console.log(`[Razorpay] Capture Payment Input Data:`, JSON.stringify(data, null, 2))

    let paymentId = (data as any).razorpay_payment_id

    // Fallback: If paymentId is missing, try to find it from the order_id
    if (!paymentId && (data as any).id) {
      console.log(`[Razorpay] Missing payment ID, attempting to fetch from order: ${(data as any).id}`)
      try {
        const payments = await this.razorpay_.orders.fetchPayments((data as any).id)
        if (payments && payments.items && payments.items.length > 0) {
          // Find the latest authorized or captured payment
          const validPayment = payments.items.find((p: any) =>
            p.status === "authorized" || p.status === "captured"
          )
          if (validPayment) {
            paymentId = validPayment.id
            console.log(`[Razorpay] Found payment ID from order: ${paymentId}`)
          }
        }
      } catch (err) {
        console.error(`[Razorpay] Failed to fetch payments for order:`, err)
      }
    }

    console.log(`[Razorpay] Capturing payment: ${paymentId}`)

    if (!paymentId) {
      console.error("[Razorpay] No payment ID found for capture")
      throw new Error("Payment ID is required to capture payment. Please ensure the payment was successful on the customer side.")
    }

    try {
      // Razorpay automatically captures payments when customer completes payment
      // We just need to fetch the payment to verify it's captured
      const payment = await this.razorpay_.payments.fetch(paymentId)

      console.log(`[Razorpay] Payment status: ${payment.status}, captured: ${payment.captured}`)

      // If payment is not captured, capture it
      if (!payment.captured && payment.status === "authorized") {
        const capturedPayment = await this.razorpay_.payments.capture(
          paymentId,
          payment.amount,
          payment.currency
        )
        console.log(`[Razorpay] Payment captured successfully: ${capturedPayment.id}`)

        return {
          data: {
            ...data,
            ...capturedPayment,
            razorpay_payment_id: paymentId,
            razorpay_payment_captured: true
          }
        }
      }

      return {
        data: {
          ...data,
          ...payment,
          razorpay_payment_id: paymentId,
          razorpay_payment_captured: payment.captured
        }
      }
    } catch (error) {
      console.error(`[Razorpay] Error capturing payment:`, error)
      this.logger_.error(`Error capturing Razorpay payment: ${error.message}`)
      throw error
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const { data } = input
    let paymentId = (data as any).razorpay_payment_id

    // Fallback: If paymentId is missing, try to find it from the order_id
    if (!paymentId && (data as any).id) {
      console.log(`[Razorpay] Authorize: Missing payment ID, attempting to fetch from order: ${(data as any).id}`)
      try {
        const payments = await this.razorpay_.orders.fetchPayments((data as any).id)
        if (payments && payments.items && payments.items.length > 0) {
          const validPayment = payments.items.find((p: any) =>
            p.status === "authorized" || p.status === "captured"
          )
          if (validPayment) {
            paymentId = validPayment.id
            console.log(`[Razorpay] Authorize: Found payment ID from order: ${paymentId}`)
          }
        }
      } catch (err) {
        console.error(`[Razorpay] Authorize: Failed to fetch payments for order:`, err)
      }
    }

    console.log(`[Razorpay] Authorizing payment: ${paymentId}`)

    if (!paymentId) {
      console.log("[Razorpay] No payment ID found, returning authorized status with existing data")
      return {
        status: "authorized",
        data: data
      }
    }

    try {
      // Fetch payment details from Razorpay
      const payment = await this.razorpay_.payments.fetch(paymentId)
      console.log(`[Razorpay] Payment fetched - Status: ${payment.status}, Captured: ${payment.captured}`)

      return {
        status: payment.captured ? "captured" : "authorized",
        data: {
          ...data,
          ...payment,
          razorpay_payment_id: paymentId,
          razorpay_payment_status: payment.status,
          razorpay_payment_captured: payment.captured
        }
      }
    } catch (error) {
      console.error(`[Razorpay] Error authorizing payment:`, error)
      this.logger_.error(`Error authorizing Razorpay payment: ${error.message}`)

      return {
        status: "authorized",
        data: {
          ...data,
          razorpay_payment_id: paymentId
        }
      }
    }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return {
      data: input.data
    }
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code } = input

    console.log(`[Razorpay] Initiating payment for amount: ${amount} ${currency_code}`)

    try {
      // In Medusa v2, amount is typically in major units if configured so, 
      // but Razorpay EXPECTS minor units (paise for INR).
      // We'll multiply by 100 to ensure we send paise.
      const razorAmount = Math.round(Number(amount) * 100)

      console.log(`[Razorpay] Creating order with amount: ${razorAmount} ${currency_code.toUpperCase()}`)

      const order = await this.razorpay_.orders.create({
        amount: razorAmount,
        currency: currency_code.toUpperCase(),
        receipt: `order_${Date.now()}`,
      })

      console.log(`[Razorpay] Order created successfully: ${order.id}`)

      return {
        id: order.id,
        data: {
          ...order,
        }
      }
    } catch (error) {
      console.error(`[Razorpay] Error initiating Razorpay payment:`, error)
      this.logger_.error(`Error initiating Razorpay payment: ${error.message}`)
      throw error
    }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return {
      data: input.data
    }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const { data } = input
    const orderId = (data as any).id

    try {
      const order = await this.razorpay_.orders.fetch(orderId)
      if (order.status === "paid") {
        return { status: "captured" }
      }
      return { status: "pending" }
    } catch (error) {
      return { status: "error" }
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    return {
      data: input.data
    }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return (input.data || {}) as RetrievePaymentOutput
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    console.log(`[Razorpay] Update Payment Input Data:`, JSON.stringify(input.data, null, 2))
    return {
      data: {
        ...(input.data || {}),
      }
    }
  }

  async getWebhookActionAndData(payload: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
    return {
      action: "not_supported",
      data: {
        session_id: "",
        amount: new BigNumber(0)
      }
    }
  }
}

export default RazorpayProviderService
