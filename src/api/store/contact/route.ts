import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONTACT_QUERY_MODULE } from "../../../modules/contact-query"
import ContactQueryModuleService from "../../../modules/contact-query/service"

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { first_name, last_name, email, subject, message } = req.body as {
    first_name: string
    last_name: string
    email: string
    subject: string
    message: string
  }

  if (!first_name || !last_name || !email || !subject || !message) {
    return res.status(400).json({ message: "All fields are required." })
  }

  const contactQueryService: ContactQueryModuleService =
    req.scope.resolve(CONTACT_QUERY_MODULE)

  const query = await contactQueryService.createContactQueries({
    first_name,
    last_name,
    email,
    subject,
    message,
  })

  return res.status(201).json({ contact_query: query })
}
