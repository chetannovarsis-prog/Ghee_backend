"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.default = passwordResetHandler;
// import { INotificationModuleService } from "@medusajs/types"
async function passwordResetHandler({ event: { data }, container, }) {
    const notificationModule = container.resolve("email_notifications");
    const logger = container.resolve("logger");
    const email = data.entity_id; // For emailpass, entity_id is often the email or we need to look it up.
    // Actually, standard auth.password_reset payload usually has { entity_id, token, actor_type }
    // If entity_id is not the email, we might need to look up the user.
    // But usually for 'emailpass' provider, the identity ID might be linked.
    // Let's assume for a moment that we need to send to the user's email.
    // The 'data' payload for auth.password_reset in Medusa v2 depends on how it's triggered.
    // If triggered via authService.generateResetToken, it emits the event.
    logger.info(`Processing password reset for ${data.entity_id}`);
    try {
        await notificationModule.send({
            to: data.entity_id, // This assumes entity_id is the email. If not, we need to fetch user.
            template: "auth.password_reset",
            data: {
                token: data.token,
                url: `http://localhost:8000/account/reset-password?token=${data.token}&email=${data.entity_id}`
            }
        });
        logger.info(`Password reset email sent to ${data.entity_id}`);
    }
    catch (error) {
        logger.error(`Failed to send password reset email: ${error}`);
    }
}
exports.config = {
    event: "auth.password_reset",
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVzZXQtcGFzc3dvcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc3Vic2NyaWJlcnMvcmVzZXQtcGFzc3dvcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBT0EsdUNBZ0NDO0FBbENELCtEQUErRDtBQUVoRCxLQUFLLFVBQVUsb0JBQW9CLENBQUMsRUFDakQsS0FBSyxFQUFFLEVBQUUsSUFBSSxFQUFFLEVBQ2YsU0FBUyxHQUNnRTtJQUN6RSxNQUFNLGtCQUFrQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMscUJBQXFCLENBQVEsQ0FBQTtJQUMxRSxNQUFNLE1BQU0sR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFBO0lBRTFDLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUEsQ0FBQyx3RUFBd0U7SUFDckcsOEZBQThGO0lBRTlGLG9FQUFvRTtJQUNwRSx5RUFBeUU7SUFFekUsc0VBQXNFO0lBQ3RFLHlGQUF5RjtJQUN6Rix1RUFBdUU7SUFFdkUsTUFBTSxDQUFDLElBQUksQ0FBQyxpQ0FBaUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDLENBQUE7SUFFOUQsSUFBSSxDQUFDO1FBQ0YsTUFBTSxrQkFBa0IsQ0FBQyxJQUFJLENBQUM7WUFDM0IsRUFBRSxFQUFFLElBQUksQ0FBQyxTQUFTLEVBQUUsc0VBQXNFO1lBQzFGLFFBQVEsRUFBRSxxQkFBcUI7WUFDL0IsSUFBSSxFQUFFO2dCQUNILEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSztnQkFDakIsR0FBRyxFQUFFLHNEQUFzRCxJQUFJLENBQUMsS0FBSyxVQUFVLElBQUksQ0FBQyxTQUFTLEVBQUU7YUFDakc7U0FDSCxDQUFDLENBQUE7UUFDRixNQUFNLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsQ0FBQTtJQUNoRSxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNkLE1BQU0sQ0FBQyxLQUFLLENBQUMsd0NBQXdDLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDaEUsQ0FBQztBQUNILENBQUM7QUFFWSxRQUFBLE1BQU0sR0FBcUI7SUFDdEMsS0FBSyxFQUFFLHFCQUFxQjtDQUM3QixDQUFBIn0=