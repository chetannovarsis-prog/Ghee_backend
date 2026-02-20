import { 
  AbstractNotificationProviderService, 
  MedusaError 
} from "@medusajs/framework/utils"
import { 
  ProviderSendNotificationDTO, 
  ProviderSendNotificationResultsDTO 
} from "@medusajs/framework/types"
import { Resend } from "resend"

type ResendOptions = {
  api_key: string
  from: string
}

type InjectedDependencies = {
  logger: any
}

export class ResendNotificationService extends AbstractNotificationProviderService {
  static identifier = "resend"
  protected resend: Resend
  protected options: ResendOptions
  protected logger: any

  constructor({ logger }: InjectedDependencies, options: ResendOptions) {
    super()
    this.logger = logger
    this.options = options
    
    if (!options.api_key) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Resend API key is missing. Please set RESEND_API_KEY in .env"
      )
    }
    
    this.resend = new Resend(options.api_key)
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    const { to, data, template } = notification
    
    if (!to) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Recipient email 'to' is required"
      )
    }

    // Map template names to subjects or use data.subject
    let subject = (data?.subject as string) || "Notification from Medusa Store"
    
    if (template === "auth.password_reset") {
       subject = "Reset your password"
    }

    // Basic HTML template for now. In a real app, use React Email or similar.
    const html = `
      <h1>${subject}</h1>
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${data?.url}">Reset Password</a></p>
      <p>Or use this token: <strong>${data?.token}</strong></p>
      <p>If you didn't request this, please ignore.</p>
    `

    try {
      this.logger.info(`Sending email to ${to} via Resend...`)
      
      const { data: emailData, error } = await this.resend.emails.send({
        from: this.options.from,
        to: [to],
        subject: subject,
        html: html,
      })

      if (error) {
        this.logger.error(`Resend Error: ${JSON.stringify(error)}`)
        throw new Error(error.message)
      }

      return { id: emailData?.id || "unknown" }
    } catch (error) {
       this.logger.error(`Failed to send email via Resend: ${error}`)
       throw error
    }
  }
}

export default ResendNotificationService
