import { ExecArgs } from "@medusajs/framework/types";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createProductCategoriesWorkflow } from "@medusajs/medusa/core-flows";

export default async function seedNewCategories({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);

  logger.info("Seeding Men and Women categories...");

  try {
    const { result: categoryResult } = await createProductCategoriesWorkflow(
      container
    ).run({
      input: {
        product_categories: [
          {
            name: "Men",
            handle: "men",
            is_active: true,
          },
          {
            name: "Women",
            handle: "women",
            is_active: true,
          },
          {
            name: "Kids",
            handle: "kids",
            is_active: true,
          },
          {
            name: "Home",
            handle: "home",
            is_active: true,
          },
          {
            name: "Beauty",
            handle: "beauty",
            is_active: true,
          }
        ],
      },
    });

    logger.info(`Successfully seeded ${categoryResult.length} categories.`);
  } catch (error) {
    logger.error(`Failed to seed categories: ${error.message}`);
  }
}
