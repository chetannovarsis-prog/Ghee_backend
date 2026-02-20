console.log("Loading Razorpay Service file")
import { AbstractPaymentProvider, BigNumber } from "@medusajs/framework/utils"
import {
  type SubscriberConfig,
  type SubscriberArgs,
} from "@medusajs/framework"
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
  static identifier = "razorpay-copy"
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
    return {
      data: input.data
    }
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    return {
      status: "authorized",
      data: input.data
    }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return {
      data: input.data
    }
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code } = input

    try {
      const order = await this.razorpay_.orders.create({
        amount: Math.round(Number(amount) * 100), // Razorpay expected amount in paise
        currency: currency_code.toUpperCase(),
        receipt: `order_${Date.now()}`,
      })

      return {
        id: order.id,
        data: {
          ...order,
        }
      }
    } catch (error) {
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
