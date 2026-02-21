"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResendNotificationService = void 0;
const utils_1 = require("@medusajs/framework/utils");
const resend_1 = require("resend");
class ResendNotificationService extends utils_1.AbstractNotificationProviderService {
    constructor({ logger }, options) {
        super();
        this.logger = logger;
        this.options = options;
        if (!options.api_key) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Resend API key is missing. Please set RESEND_API_KEY in .env");
        }
        this.resend = new resend_1.Resend(options.api_key);
    }
    async send(notification) {
        const { to, data, template } = notification;
        if (!to) {
            throw new utils_1.MedusaError(utils_1.MedusaError.Types.INVALID_DATA, "Recipient email 'to' is required");
        }
        // Map template names to subjects or use data.subject
        let subject = data?.subject || "Notification from Medusa Store";
        if (template === "auth.password_reset") {
            subject = "Reset your password";
        }
        // Basic HTML template for now. In a real app, use React Email or similar.
        const html = `
      <h1>${subject}</h1>
      <p>Hello,</p>
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <p><a href="${data?.url}">Reset Password</a></p>
      <p>Or use this token: <strong>${data?.token}</strong></p>
      <p>If you didn't request this, please ignore.</p>
    `;
        try {
            this.logger.info(`Sending email to ${to} via Resend...`);
            const { data: emailData, error } = await this.resend.emails.send({
                from: this.options.from,
                to: [to],
                subject: subject,
                html: html,
            });
            if (error) {
                this.logger.error(`Resend Error: ${JSON.stringify(error)}`);
                throw new Error(error.message);
            }
            return { id: emailData?.id || "unknown" };
        }
        catch (error) {
            this.logger.error(`Failed to send email via Resend: ${error}`);
            throw error;
        }
    }
}
exports.ResendNotificationService = ResendNotificationService;
ResendNotificationService.identifier = "resend";
exports.default = ResendNotificationService;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZW5kLXByb3ZpZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL21vZHVsZXMvZW1haWxfbm90aWZpY2F0aW9ucy9zZXJ2aWNlcy9yZXNlbmQtcHJvdmlkZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQUEscURBR2tDO0FBS2xDLG1DQUErQjtBQVcvQixNQUFhLHlCQUEwQixTQUFRLDJDQUFtQztJQU1oRixZQUFZLEVBQUUsTUFBTSxFQUF3QixFQUFFLE9BQXNCO1FBQ2xFLEtBQUssRUFBRSxDQUFBO1FBQ1AsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUE7UUFDcEIsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUE7UUFFdEIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztZQUNyQixNQUFNLElBQUksbUJBQVcsQ0FDbkIsbUJBQVcsQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUM5Qiw4REFBOEQsQ0FDL0QsQ0FBQTtRQUNILENBQUM7UUFFRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksZUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQTtJQUMzQyxDQUFDO0lBRUQsS0FBSyxDQUFDLElBQUksQ0FDUixZQUF5QztRQUV6QyxNQUFNLEVBQUUsRUFBRSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxZQUFZLENBQUE7UUFFM0MsSUFBSSxDQUFDLEVBQUUsRUFBRSxDQUFDO1lBQ1IsTUFBTSxJQUFJLG1CQUFXLENBQ25CLG1CQUFXLENBQUMsS0FBSyxDQUFDLFlBQVksRUFDOUIsa0NBQWtDLENBQ25DLENBQUE7UUFDSCxDQUFDO1FBRUQscURBQXFEO1FBQ3JELElBQUksT0FBTyxHQUFJLElBQUksRUFBRSxPQUFrQixJQUFJLGdDQUFnQyxDQUFBO1FBRTNFLElBQUksUUFBUSxLQUFLLHFCQUFxQixFQUFFLENBQUM7WUFDdEMsT0FBTyxHQUFHLHFCQUFxQixDQUFBO1FBQ2xDLENBQUM7UUFFRCwwRUFBMEU7UUFDMUUsTUFBTSxJQUFJLEdBQUc7WUFDTCxPQUFPOzs7b0JBR0MsSUFBSSxFQUFFLEdBQUc7c0NBQ1MsSUFBSSxFQUFFLEtBQUs7O0tBRTVDLENBQUE7UUFFRCxJQUFJLENBQUM7WUFDSCxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFBO1lBRXhELE1BQU0sRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxHQUFHLE1BQU0sSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO2dCQUMvRCxJQUFJLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJO2dCQUN2QixFQUFFLEVBQUUsQ0FBQyxFQUFFLENBQUM7Z0JBQ1IsT0FBTyxFQUFFLE9BQU87Z0JBQ2hCLElBQUksRUFBRSxJQUFJO2FBQ1gsQ0FBQyxDQUFBO1lBRUYsSUFBSSxLQUFLLEVBQUUsQ0FBQztnQkFDVixJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUE7Z0JBQzNELE1BQU0sSUFBSSxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFBO1lBQ2hDLENBQUM7WUFFRCxPQUFPLEVBQUUsRUFBRSxFQUFFLFNBQVMsRUFBRSxFQUFFLElBQUksU0FBUyxFQUFFLENBQUE7UUFDM0MsQ0FBQztRQUFDLE9BQU8sS0FBSyxFQUFFLENBQUM7WUFDZCxJQUFJLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxvQ0FBb0MsS0FBSyxFQUFFLENBQUMsQ0FBQTtZQUM5RCxNQUFNLEtBQUssQ0FBQTtRQUNkLENBQUM7SUFDSCxDQUFDOztBQXRFSCw4REF1RUM7QUF0RVEsb0NBQVUsR0FBRyxRQUFRLENBQUE7QUF3RTlCLGtCQUFlLHlCQUF5QixDQUFBIn0=