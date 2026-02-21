"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = debugPaymentMethods;
const utils_1 = require("@medusajs/framework/utils");
async function debugPaymentMethods({ container }) {
    const paymentModule = container.resolve(utils_1.Modules.PAYMENT);
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    logger.info("Debugging Payment Methods from Payment Module...");
    try {
        const providers = await paymentModule.listPaymentProviders({}, { skip: 0, take: 100 });
        logger.info("All Payment Providers in Payment Module:");
        providers.forEach(p => {
            logger.info(`- ID: ${p.id}, is_enabled: ${p.is_enabled}`);
        });
        // Check if our specific provider has methods
        // In V2, we can try to resolve the provider directly from the container to see if it works
        const razorpayProvider = container.resolve("pp_razorpay_razorpay");
        if (razorpayProvider && razorpayProvider.getPaymentMethods) {
            const methods = await razorpayProvider.getPaymentMethods();
            logger.info("Methods from pp_razorpay_razorpay:");
            logger.info(JSON.stringify(methods, null, 2));
        }
        else {
            logger.error("Could not resolve pp_razorpay_razorpay or it has no getPaymentMethods");
        }
    }
    catch (err) {
        logger.error(`Error debugging payment methods: ${err.message}`);
        if (err.stack)
            logger.error(err.stack);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWctcGF5bWVudC1tZXRob2RzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvZGVidWctcGF5bWVudC1tZXRob2RzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBR0Esc0NBNEJDO0FBOUJELHFEQUE4RTtBQUUvRCxLQUFLLFVBQVUsbUJBQW1CLENBQUMsRUFBRSxTQUFTLEVBQUU7SUFDM0QsTUFBTSxhQUFhLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsT0FBTyxDQUFDLENBQUE7SUFDeEQsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUVsRSxNQUFNLENBQUMsSUFBSSxDQUFDLGtEQUFrRCxDQUFDLENBQUE7SUFFL0QsSUFBSSxDQUFDO1FBQ0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxhQUFhLENBQUMsb0JBQW9CLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQTtRQUN0RixNQUFNLENBQUMsSUFBSSxDQUFDLDBDQUEwQyxDQUFDLENBQUE7UUFDdkQsU0FBUyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNsQixNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLEVBQUUsaUJBQWlCLENBQUMsQ0FBQyxVQUFVLEVBQUUsQ0FBQyxDQUFBO1FBQzdELENBQUMsQ0FBQyxDQUFBO1FBRUYsNkNBQTZDO1FBQzdDLDJGQUEyRjtRQUMzRixNQUFNLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsc0JBQXNCLENBQUMsQ0FBQTtRQUNsRSxJQUFJLGdCQUFnQixJQUFJLGdCQUFnQixDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDekQsTUFBTSxPQUFPLEdBQUcsTUFBTSxnQkFBZ0IsQ0FBQyxpQkFBaUIsRUFBRSxDQUFBO1lBQzFELE1BQU0sQ0FBQyxJQUFJLENBQUMsb0NBQW9DLENBQUMsQ0FBQTtZQUNqRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ2pELENBQUM7YUFBTSxDQUFDO1lBQ0osTUFBTSxDQUFDLEtBQUssQ0FBQyx1RUFBdUUsQ0FBQyxDQUFBO1FBQ3pGLENBQUM7SUFFTCxDQUFDO0lBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNYLE1BQU0sQ0FBQyxLQUFLLENBQUMsb0NBQW9DLEdBQUcsQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQy9ELElBQUksR0FBRyxDQUFDLEtBQUs7WUFBRSxNQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUMxQyxDQUFDO0FBQ0wsQ0FBQyJ9