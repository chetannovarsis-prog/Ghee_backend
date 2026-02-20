/**
 * Ghee Product Metadata Types
 * 
 * These types define the structure of ghee-specific attributes
 * stored in the product metadata field.
 */

export type CowBreed = 'Gir' | 'Sahiwal' | 'Red Sindhi' | 'Buffalo' | 'Mixed' | 'Other'

export type ProcessingMethod = 'Bilona' | 'Traditional' | 'Vedic' | 'Modern' | 'Other'

export type PackagingType = 'Glass Jar' | 'Pet Bottle' | 'Tin' | 'Other'

/**
 * Ghee-specific product metadata interface
 * Extends the base product metadata with ghee attributes
 */
export interface GheeProductMetadata {
  // Ghee-specific attributes
  purity_percentage?: number
  cow_breed?: CowBreed
  processing_method?: ProcessingMethod
  origin?: string
  packaging_type?: PackagingType
  grass_fed?: boolean
  organic_certified?: boolean
  shelf_life_months?: number
  
  // Existing e-commerce fields
  rating?: number
  reviews_count?: number
  badge?: string
  best_price_coupon?: string
}

/**
 * Request body for updating ghee attributes
 */
export interface UpdateGheeAttributesRequest {
  productId: string
  metadata: Partial<GheeProductMetadata>
}

/**
 * Response for ghee attributes endpoint
 */
export interface GheeAttributesResponse {
  productId: string
  metadata: GheeProductMetadata
  updated: boolean
}
