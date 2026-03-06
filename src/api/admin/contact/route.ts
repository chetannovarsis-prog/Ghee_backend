import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { CONTACT_QUERY_MODULE } from "../../../modules/contact-query"
import ContactQueryModuleService from "../../../modules/contact-query/service"

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const contactQueryService: ContactQueryModuleService =
    req.scope.resolve(CONTACT_QUERY_MODULE)

  const queries = await contactQueryService.listContactQueries(
    {},
    { order: { created_at: "DESC" } }
  )

  return res.json({ contact_queries: queries, count: queries.length })
}
