import { model } from "@medusajs/framework/utils"

const ProductReview = model.define("product_review", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  customer_name: model.text(),
  rating: model.number(),
  comment: model.text().nullable(),
})

export default ProductReview
