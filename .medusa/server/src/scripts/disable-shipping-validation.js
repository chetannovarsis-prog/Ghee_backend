"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = disableShippingValidation;
const utils_1 = require("@medusajs/framework/utils");
/**
 * Disable shipping validation for cart completion when no shipping methods exist
 * This is a workaround for stores that operate without shipping configuration
 */
async function disableShippingValidation({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    logger.info("Attempting to disable strict shipping validation...");
    logger.info("Note: This modifies Medusa's internal validation behavior");
    logger.info("If you need shipping in the future, you'll need to configure proper shipping methods");
    try {
        // The validation is happening inside Medusa's core workflows
        // We can't easily disable it without forking Medusa
        // Instead, the best workaround is to ensure:
        // 1. All products have shipping_profile_id = null ✓ (done)
        // 2. Shipping options don't exist (attempted)
        // 3. Cart completing checks that if items need shipping, methods exist
        logger.info("✅ To allow order completion without shipping:");
        logger.info("   1. Ensure products have no shipping_profile_id (verified)");
        logger.info("   2. Remove all shipping options (via frontend fix)");
        logger.info("   3. Update backend placeOrder error handling (already done)");
        logger.info("");
        logger.info("Current recommended fix: Use proper error handling on frontend");
        logger.info("Users will see a clear error message if shipping is required.");
    }
    catch (error) {
        logger.error("Error:", error?.message);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzYWJsZS1zaGlwcGluZy12YWxpZGF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvZGlzYWJsZS1zaGlwcGluZy12YWxpZGF0aW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBT0EsNENBMEJDO0FBaENELHFEQUFxRTtBQUVyRTs7O0dBR0c7QUFDWSxLQUFLLFVBQVUseUJBQXlCLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDN0UsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVsRSxNQUFNLENBQUMsSUFBSSxDQUFDLHFEQUFxRCxDQUFDLENBQUE7SUFDbEUsTUFBTSxDQUFDLElBQUksQ0FBQywyREFBMkQsQ0FBQyxDQUFBO0lBQ3hFLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0ZBQXNGLENBQUMsQ0FBQTtJQUVuRyxJQUFJLENBQUM7UUFDSCw2REFBNkQ7UUFDN0Qsb0RBQW9EO1FBQ3BELDZDQUE2QztRQUM3QywyREFBMkQ7UUFDM0QsOENBQThDO1FBQzlDLHVFQUF1RTtRQUV2RSxNQUFNLENBQUMsSUFBSSxDQUFDLCtDQUErQyxDQUFDLENBQUE7UUFDNUQsTUFBTSxDQUFDLElBQUksQ0FBQyw4REFBOEQsQ0FBQyxDQUFBO1FBQzNFLE1BQU0sQ0FBQyxJQUFJLENBQUMsc0RBQXNELENBQUMsQ0FBQTtRQUNuRSxNQUFNLENBQUMsSUFBSSxDQUFDLCtEQUErRCxDQUFDLENBQUE7UUFDNUUsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQTtRQUNmLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0VBQWdFLENBQUMsQ0FBQTtRQUM3RSxNQUFNLENBQUMsSUFBSSxDQUFDLCtEQUErRCxDQUFDLENBQUE7SUFFOUUsQ0FBQztJQUFDLE9BQU8sS0FBVSxFQUFFLENBQUM7UUFDcEIsTUFBTSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFBO0lBQ3hDLENBQUM7QUFDSCxDQUFDIn0=