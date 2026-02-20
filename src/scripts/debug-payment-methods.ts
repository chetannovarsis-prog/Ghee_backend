
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

export default async function debugPaymentMethods({ container }) {
    const paymentModule = container.resolve(Modules.PAYMENT)
    const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

    logger.info("Debugging Payment Methods from Payment Module...")

    try {
        const providers = await paymentModule.listPaymentProviders({}, { skip: 0, take: 100 })
        logger.info("All Payment Providers in Payment Module:")
        providers.forEach(p => {
            logger.info(`- ID: ${p.id}, is_enabled: ${p.is_enabled}`)
        })

        // Check if our specific provider has methods
        // In V2, we can try to resolve the provider directly from the container to see if it works
        const razorpayProvider = container.resolve("pp_razorpay_razorpay")
        if (razorpayProvider && razorpayProvider.getPaymentMethods) {
            const methods = await razorpayProvider.getPaymentMethods()
            logger.info("Methods from pp_razorpay_razorpay:")
            logger.info(JSON.stringify(methods, null, 2))
        } else {
            logger.error("Could not resolve pp_razorpay_razorpay or it has no getPaymentMethods")
        }

    } catch (err) {
        logger.error(`Error debugging payment methods: ${err.message}`)
        if (err.stack) logger.error(err.stack)
    }
}
