
import { 
  AbstractPaymentProvider, 
  PaymentSessionStatus, 
  PaymentActions
} from "@medusajs/framework/utils"
import { 
  Logger,
  InitiatePaymentInput, 
  InitiatePaymentOutput, 
  CapturePaymentInput, 
  CapturePaymentOutput, 
  AuthorizePaymentInput, 
  AuthorizePaymentOutput, 
  CancelPaymentInput, 
  CancelPaymentOutput, 
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
import crypto from "crypto"



class ManualPaymentProvider extends AbstractPaymentProvider {
  static identifier = "manual"
  
  async getStatus(_: any): Promise<string> {
    return "authorized"
  }

  async getPaymentData(_: any): Promise<Record<string, unknown>> {
    return {}
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    return { data: {}, id: crypto.randomUUID() }
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    return { status: "authorized" }
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    return {}
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    return { data: {}, status: PaymentSessionStatus.AUTHORIZED }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return { data: {} }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: {} }
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return { data: {} }
  }

  async retrieveAccountHolder(input: any): Promise<any> {
    return { id: input.id }
  }

  async createAccountHolder(input: any): Promise<any> {
    return { id: input.context.customer.id }
  }

  async deleteAccountHolder(input: any): Promise<any> {
    return { data: {} }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    return { data: {} }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: {} }
  }

  async getWebhookActionAndData(data: ProviderWebhookPayload["payload"]): Promise<WebhookActionResult> {
    return { action: PaymentActions.NOT_SUPPORTED }
  }
}

export default ManualPaymentProvider
