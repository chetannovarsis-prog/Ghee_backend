console.log("Loading Razorpay Module index.ts")
import RazorpayProviderService from "./service"
console.log("Imported RazorpayProviderService:", RazorpayProviderService)

const services = [RazorpayProviderService]
console.log("Exporting services:", services)

export default {
  services,
}

