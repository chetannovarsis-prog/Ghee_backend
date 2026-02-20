import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import { ApiKey } from "../../.medusa/types/query-entry-points";

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => {
              return {
                currency_code: currency.currency_code,
                is_default: currency.is_default ?? false,
              };
            }
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedUserData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const countries = ["in", "us", "gb", "de", "dk", "se", "fr", "es", "it"];

  logger.info("Seeding store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "Default Sales Channel",
  });

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "Default Sales Channel",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "inr",
          is_default: true,
        },
        {
          currency_code: "usd",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("Seeding region data...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries: ["in"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const region = regionResult[0];
  logger.info("Finished seeding regions.");

  // Stock Location
  logger.info("Seeding stock location data...");
  let stockLocation;
  try {
      const { result: stockLocationResult } = await createStockLocationsWorkflow(
        container
      ).run({
        input: {
          locations: [
            {
              name: "Main Warehouse",
              address: {
                city: "Indore",
                country_code: "IN",
                address_1: "Warehouse 1",
              },
            },
          ],
        },
      });
      stockLocation = stockLocationResult[0];
  } catch (e) {
      // assume it exists or handle duplication if needed, but for now we create as it's a seed
      // If it fails, we might need to fetch existing.
       const { data: stockLocations } = await query.graph({
          entity: "stock_location",
          fields: ["id"],
        });
        if (stockLocations.length > 0) {
            stockLocation = stockLocations[0];
        }
  }

  if (stockLocation) {
      await updateStoresWorkflow(container).run({
        input: {
          selector: { id: store.id },
          update: {
            default_location_id: stockLocation.id,
          },
        },
      });

      await link.create({
        [Modules.STOCK_LOCATION]: {
          stock_location_id: stockLocation.id,
        },
        [Modules.FULFILLMENT]: {
          fulfillment_provider_id: "manual_manual",
        },
      });
  }


  logger.info("Seeding fulfillment data...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "India Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "India",
        geo_zones: [
          {
            country_code: "in",
            type: "country",
          },
        ],
      },
    ],
  });

  if (stockLocation) {
      await link.create({
        [Modules.STOCK_LOCATION]: {
          stock_location_id: stockLocation.id,
        },
        [Modules.FULFILLMENT]: {
          fulfillment_set_id: fulfillmentSet.id,
        },
      });
  }

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Standard Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Standard delivery",
          code: "standard",
        },
        prices: [
          {
            currency_code: "inr",
            amount: 50,
          },
          {
            region_id: region.id,
            amount: 50,
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
    ],
  });
  logger.info("Finished seeding fulfillment data.");

  // API Key
    logger.info("Seeding publishable API key data...");
  let publishableApiKey: ApiKey | null = null;
  const { data } = await query.graph({
    entity: "api_key",
    fields: ["id"],
    filters: {
      type: "publishable",
    },
  });

  publishableApiKey = data?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "Webshop",
            type: "publishable",
            created_by: "system",
          },
        ],
      },
    });

    publishableApiKey = publishableApiKeyResult as ApiKey;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });
  logger.info("Finished seeding publishable API key data.");


  logger.info("Seeding user product data...");

  // Categories
  // categories: Atta, Ghee, Health
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Atta",
          is_active: true,
          handle: "atta"
        },
        {
          name: "Ghee",
          is_active: true,
           handle: "ghee-cat"
        },
        {
            name: "Health",
            is_active: true,
            handle: "health"
        }
      ],
    },
  });

  const attaCatId = categoryResult.find((c) => c.name === "Atta")?.id;
  const gheeCatId = categoryResult.find((c) => c.name === "Ghee")?.id;
  const healthCatId = categoryResult.find((c) => c.name === "Health")?.id;

  const productsData = [
      {
          title: "Multigrain Atta",
          handle: "multigrain-atta",
          category_ids: [attaCatId!],
          description: "Healthy Multigrain Atta",
          price: 180,
          variantTitle: "1 Pack",
          sku: "MULTI-ATTA-1"
      },
      {
          title: "Whole Wheat Atta",
          handle: "whole-wheat-atta",
          category_ids: [attaCatId!],
          description: "Pure Whole Wheat Atta",
          price: 150,
          variantTitle: "1 Pack",
           sku: "WHEAT-ATTA-1"
      },
      {
          title: "Jowar Atta",
          handle: "jowar-atta",
          category_ids: [attaCatId!],
          description: "Fresh Jowar Atta",
          price: 170,
          variantTitle: "1 Pack",
           sku: "JOWAR-ATTA-1"
      },
      {
          title: "Bajra Atta",
          handle: "bajra-atta",
          category_ids: [attaCatId!],
          description: "Healthy Bajra Atta",
          price: 130,
          variantTitle: "1 Pack",
           sku: "BAJRA-ATTA-1"
      },
      {
          title: "Moringa Sattu",
          handle: "moringa-sattu",
          category_ids: [attaCatId!, healthCatId!],
          description: "Moringa Sattu 500g Pack",
          price: 220,
           variantTitle: "500g",
            sku: "MORINGA-SATTU-500"
      },
      {
          title: "Sattu",
          handle: "sattu",
          category_ids: [attaCatId!],
          description: "Sattu 500g Pack",
          price: 190,
           variantTitle: "500g",
            sku: "SATTU-500"
      },
      {
          title: "Gousarram Capsule",
          handle: "gousarram-capsule",
          category_ids: [healthCatId!],
          description: "Gousarram Capsule 30 pcs pack bottle",
          price: 750,
           variantTitle: "30 pcs Bottle",
            sku: "GOUSARRAM-CAP-30"
      },
      {
          title: "Ghee",
          handle: "ghee-500",
          category_ids: [gheeCatId!],
          description: "Pure Ghee 500g Bottle",
          price: 1800,
           variantTitle: "500g Bottle",
            sku: "GHEE-500"
      }
  ];

  const productsInput = productsData.map(p => ({
      title: p.title,
      handle: p.handle,
      category_ids: p.category_ids.filter(Boolean),
      description: p.description,
      status: ProductStatus.PUBLISHED,
      shipping_profile_id: shippingProfile.id,
      options: [
        {
          title: "Option",
          values: [p.variantTitle],
        },
      ],
      variants: [
        {
          title: p.variantTitle,
          sku: p.sku,
          options: {
              Option: p.variantTitle
          },
          prices: [
            {
              amount: p.price,
              currency_code: "inr",
            },
            {
                amount: Math.round(p.price / 84), // approx USD
                currency_code: "usd",
              },
          ],
        },
      ],
      sales_channels: [
        {
          id: defaultSalesChannel[0].id,
        },
      ],
      // Placeholder image
      images: [{url: "https://placehold.co/600x400?text=" + encodeURIComponent(p.title)}]
  }));


  await createProductsWorkflow(container).run({
    input: {
      products: productsInput,
    },
  });
  logger.info("Finished seeding product data.");

  logger.info("Seeding inventory levels...");
  // Get all inventory items (created by product creation)
    const { data: inventoryItems } = await query.graph({
      entity: "inventory_item",
      fields: ["id"],
    });

    const inventoryLevels: CreateInventoryLevelInput[] = [];
    if (stockLocation) {
        for (const inventoryItem of inventoryItems) {
            // Random stock 500-1000
            const randomStock = Math.floor(Math.random() * (1000 - 500 + 1)) + 500;
            const inventoryLevel = {
              location_id: stockLocation.id,
              stocked_quantity: randomStock,
              inventory_item_id: inventoryItem.id,
            };
            inventoryLevels.push(inventoryLevel);
          }

          await createInventoryLevelsWorkflow(container).run({
            input: {
              inventory_levels: inventoryLevels,
            },
          });
    }

  logger.info("Finished seeding inventory levels data.");
}
