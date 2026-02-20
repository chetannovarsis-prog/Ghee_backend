import { 
  SubscriberArgs, 
  SubscriberConfig 
} from "@medusajs/medusa"
import { Modules } from "@medusajs/framework/utils"
// import { INotificationModuleService } from "@medusajs/types"

export default async function passwordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<{ entity_id: string; token: string; actor_type: string }>) {
  const notificationModule = container.resolve("email_notifications") as any
  const logger = container.resolve("logger")

  const email = data.entity_id // For emailpass, entity_id is often the email or we need to look it up.
  // Actually, standard auth.password_reset payload usually has { entity_id, token, actor_type }
  
  // If entity_id is not the email, we might need to look up the user.
  // But usually for 'emailpass' provider, the identity ID might be linked.
  
  // Let's assume for a moment that we need to send to the user's email.
  // The 'data' payload for auth.password_reset in Medusa v2 depends on how it's triggered.
  // If triggered via authService.generateResetToken, it emits the event.
  
  logger.info(`Processing password reset for ${data.entity_id}`)

  try {
     await notificationModule.send({
        to: data.entity_id, // This assumes entity_id is the email. If not, we need to fetch user.
        template: "auth.password_reset",
        data: {
           token: data.token,
           url: `http://localhost:8000/account/reset-password?token=${data.token}&email=${data.entity_id}`
        }
     })
     logger.info(`Password reset email sent to ${data.entity_id}`)
  } catch (error) {
     logger.error(`Failed to send password reset email: ${error}`)
  }
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
