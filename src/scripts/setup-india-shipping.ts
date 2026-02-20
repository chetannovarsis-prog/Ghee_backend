
import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { createShippingOptionsWorkflow } from "@medusajs/medusa/core-flows"

export default async function setupIndiaShipping({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const fulfillmentModule = container.resolve(Modules.FULFILLMENT)
  const regionModule = container.resolve(Modules.REGION)

  logger.info("Starting India Shipping Setup (v4)...")

  try {
    // 1. Get India region
    const regions = await regionModule.listRegions({ name: "India" })
    const indiaRegion = regions[0]
    if (!indiaRegion) {
      throw new Error("India region not found. Please create it first.")
    }
    logger.info(`Found India region: ${indiaRegion.id}`)

    // 2. Get Fulfillment Set
    const [fulfillmentSet] = await fulfillmentModule.listFulfillmentSets({
      name: ["India Warehouse delivery", "European Warehouse delivery"],
    })
    if (!fulfillmentSet) {
      throw new Error("Default fulfillment set not found.")
    }
    logger.info(`Using fulfillment set: ${fulfillmentSet.id}`)

    // 3. Check for India Service Zone
    let indiaZone = (await fulfillmentModule.listServiceZones({
      name: "India",
      fulfillment_set: { id: fulfillmentSet.id }
    }))[0]

    if (!indiaZone) {
      logger.info("Creating India Service Zone directly...")
      indiaZone = await fulfillmentModule.createServiceZones({
        name: "India",
        fulfillment_set_id: fulfillmentSet.id,
        geo_zones: [
          {
            type: "country",
            country_code: "in",
          }
        ]
      })
      logger.info(`Created India Service Zone: ${indiaZone.id}`)
    } else {
      logger.info(`India Service Zone already exists: ${indiaZone.id}`)
    }

    // 4. Get Default Shipping Profile
    const profiles = await fulfillmentModule.listShippingProfiles({
      name: ["Default", "Default Shipping Profile"],
    })
    const shippingProfile = profiles[0]
    if (!shippingProfile) {
      throw new Error("Default shipping profile not found.")
    }
    logger.info(`Using shipping profile: ${shippingProfile.name} (${shippingProfile.id})`)

    // 5. Check if Shipping Option already exists and delete it to update
    const existingOptions = await fulfillmentModule.listShippingOptions({
      name: "Standard Shipping",
      service_zone: { id: indiaZone.id }
    })

    if (existingOptions.length > 0) {
      logger.info("Found existing Standard Shipping option. Deleting it to update...")
      // In v2 we can use the fulfillment module direct delete or workflow
      for (const opt of existingOptions) {
          await fulfillmentModule.deleteShippingOptions(opt.id)
      }
      logger.info("Existing options deleted.")
    }
    
    // 6. Create Shipping Option for India
    logger.info("Creating Free Shipping Option for India...")
      // IMPORTANT: In Medusa v2, createShippingOptionsWorkflow expects an ARRAY as input
      await createShippingOptionsWorkflow(container).run({
        input: [
            {
              name: "Standard Shipping",
              price_type: "flat",
              provider_id: "manual_manual",
              service_zone_id: indiaZone.id,
              shipping_profile_id: shippingProfile.id,
              type: {
                label: "Standard",
                description: "Standard delivery",
                code: "standard",
              },
              prices: [
                {
                  currency_code: "inr",
                  amount: 0,
                },
              ],
              rules: [
                {
                  attribute: "enabled_in_store",
                  value: "true",
                  operator: "eq",
                },
                {
                  attribute: "is_return",
                  value: "false",
                  operator: "eq",
                },
              ],
            },
            {
              name: "Cash on Delivery",
              price_type: "flat",
              provider_id: "manual_manual",
              service_zone_id: indiaZone.id,
              shipping_profile_id: shippingProfile.id,
              type: {
                label: "COD",
                description: "Pay on delivery",
                code: "cod",
              },
              prices: [
                {
                  currency_code: "inr",
                  amount: 5000, // 50 INR fee for COD
                },
              ],
              rules: [
                {
                  attribute: "enabled_in_store",
                  value: "true",
                  operator: "eq",
                },
              ],
            },
        ],
      })
      logger.info("India Shipping Option created successfully.")
    
    logger.info("India Shipping Setup COMPLETE!")
  } catch (err) {
    logger.error(`Error during India Shipping Setup: ${err.message}`)
    if (err.stack) {
        logger.error(err.stack)
    }
    throw err
  }
}
