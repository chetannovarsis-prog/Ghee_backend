import { Module } from "@medusajs/framework/utils"
import ResendNotificationService from "./services/resend-provider"

export const EmailNotificationsModule = "email_notifications"

export default Module(EmailNotificationsModule, {
  service: ResendNotificationService,
})
