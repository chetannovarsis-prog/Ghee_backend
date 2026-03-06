import { Module } from "@medusajs/framework/utils"
import ContactQueryModuleService from "./service"

export const CONTACT_QUERY_MODULE = "contactQuery"

export default Module(CONTACT_QUERY_MODULE, {
  service: ContactQueryModuleService,
})
