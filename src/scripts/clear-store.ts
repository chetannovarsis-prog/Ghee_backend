import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
/* 
Note: Delete workflows are available but for a script like this, 
we can also use the service directly if we are careful.
*/

export default async function clearStore({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModule = container.resolve(Modules.PRODUCT)

  logger.info("Clearing store data...")

  const products = await productModule.listProducts({}, { select: ["id"] })
  if (products.length > 0) {
    await productModule.deleteProducts(products.map(p => p.id))
    logger.info(`Deleted ${products.length} products`)
  }

  const collections = await productModule.listCollections({}, { select: ["id"] })
  if (collections.length > 0) {
    await productModule.deleteCollections(collections.map(c => c.id))
    logger.info(`Deleted ${collections.length} collections`)
  }

  const categories = await productModule.listProductCategories({}, { select: ["id"] })
  if (categories.length > 0) {
    await productModule.deleteProductCategories(categories.map(c => c.id))
    logger.info(`Deleted ${categories.length} categories`)
  }

  logger.info("Store cleared successfully.")
}
