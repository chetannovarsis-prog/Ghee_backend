import { model } from "@medusajs/framework/utils"

const ContactQuery = model.define("contact_query", {
  id: model.id().primaryKey(),
  first_name: model.text(),
  last_name: model.text(),
  email: model.text(),
  subject: model.text(),
  message: model.text(),
})

export default ContactQuery
