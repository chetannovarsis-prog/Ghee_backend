import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { PRODUCT_REVIEW_MODULE } from "../../../modules/product-review"
import ProductReviewModuleService from "../../../modules/product-review/service"

/**
 * GET /store/reviews?product_id=xxx
 * Returns all reviews for a product + aggregate stats
 */
export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const { product_id } = req.query

  if (!product_id || typeof product_id !== "string") {
    return res.status(400).json({ message: "product_id query param is required" })
  }

  const reviewService: ProductReviewModuleService = req.scope.resolve(PRODUCT_REVIEW_MODULE)

  const reviews = await reviewService.listProductReviews(
    { product_id },
    { order: { created_at: "DESC" } }
  )

  const count = reviews.length
  const avg_rating =
    count > 0
      ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / count) * 10) / 10
      : 0

  return res.json({ reviews, count, avg_rating })
}

/**
 * POST /store/reviews
 * Creates a new product review
 */
export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const { product_id, customer_name, rating, comment } = req.body as {
    product_id: string
    customer_name: string
    rating: number
    comment?: string
  }

  if (!product_id || !customer_name || !rating) {
    return res.status(400).json({ message: "product_id, customer_name and rating are required" })
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: "rating must be between 1 and 5" })
  }

  const reviewService: ProductReviewModuleService = req.scope.resolve(PRODUCT_REVIEW_MODULE)

  const review = await reviewService.createProductReviews({
    product_id,
    customer_name: customer_name.trim().slice(0, 100),
    rating: Math.round(rating),
    comment: comment?.trim().slice(0, 1000) || null,
  })

  return res.status(201).json({ review })
}

// Public route — no auth required
export const AUTHENTICATE = false
