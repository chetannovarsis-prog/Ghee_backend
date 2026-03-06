import { MedusaService } from "@medusajs/framework/utils"
import ContactQuery from "./models/contact-query"

class ContactQueryModuleService extends MedusaService({
  ContactQuery,
}) {}

export default ContactQueryModuleService
