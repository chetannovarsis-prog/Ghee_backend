"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = disableShippingRequirements;
const utils_1 = require("@medusajs/framework/utils");
/**
 * Disables shipping requirements for all products/variants and clears shipping profiles.
 * Use this when you want to place orders WITHOUT any shipping methods.
 */
async function disableShippingRequirements({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Disabling shipping requirements for all products/variants...");
    const { data: products } = await query.graph({
        entity: "product",
        fields: [
            "id",
            "title",
            "shipping_profile",
            "variants.id",
            "variants.title",
            "variants.requires_shipping",
        ],
    });
    let productsUpdated = 0;
    let variantsUpdated = 0;
    const productModule = container.resolve(utils_1.Modules.PRODUCT);
    for (const product of products) {
        if (product.shipping_profile) {
            await query.update({
                entity: "product",
                where: { id: product.id },
                data: { shipping_profile: null }
            });
            productsUpdated += 1;
            logger.info(`✓ Cleared shipping profile for product: ${product.title}`);
        }
        if (Array.isArray(product.variants)) {
            for (const variant of product.variants) {
                if (variant.requires_shipping !== false) {
                    await productModule.updateProductVariants(product.id, [{
                            id: variant.id,
                            requires_shipping: false,
                        }]);
                    variantsUpdated += 1;
                    logger.info(`✓ Disabled requires_shipping for variant: ${variant.title || variant.id}`);
                }
            }
        }
    }
    // The original code had a check for `variantManager` which was not defined.
    // This block is removed as it's likely a remnant or incorrect.
    // if (!variantManager) {
    //   logger.warn(
    //     "ProductVariantManager not found. Variants were not updated. " +
    //     "Please set requires_shipping = false for all variants via Admin/API."
    //   )
    // }
    logger.info(`\n✅ Done. Products updated: ${productsUpdated}, Variants updated: ${variantsUpdated}`);
    logger.info("You can now complete orders without shipping methods.");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzYWJsZS1zaGlwcGluZy1yZXF1aXJlbWVudHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvc2NyaXB0cy9kaXNhYmxlLXNoaXBwaW5nLXJlcXVpcmVtZW50cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQU9BLDhDQThEQztBQXBFRCxxREFBOEU7QUFFOUU7OztHQUdHO0FBQ1ksS0FBSyxVQUFVLDJCQUEyQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQy9FLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVoRSxNQUFNLENBQUMsSUFBSSxDQUFDLDhEQUE4RCxDQUFDLENBQUE7SUFFM0UsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDM0MsTUFBTSxFQUFFLFNBQVM7UUFDakIsTUFBTSxFQUFFO1lBQ04sSUFBSTtZQUNKLE9BQU87WUFDUCxrQkFBa0I7WUFDbEIsYUFBYTtZQUNiLGdCQUFnQjtZQUNoQiw0QkFBNEI7U0FDN0I7S0FDRixDQUFDLENBQUE7SUFFRixJQUFJLGVBQWUsR0FBRyxDQUFDLENBQUE7SUFDdkIsSUFBSSxlQUFlLEdBQUcsQ0FBQyxDQUFBO0lBQ3ZCLE1BQU0sYUFBYSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLE9BQU8sQ0FBQyxDQUFBO0lBRXhELEtBQUssTUFBTSxPQUFPLElBQUksUUFBUSxFQUFFLENBQUM7UUFDL0IsSUFBSyxPQUFlLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztZQUN0QyxNQUFPLEtBQWEsQ0FBQyxNQUFNLENBQUM7Z0JBQzFCLE1BQU0sRUFBRSxTQUFTO2dCQUNqQixLQUFLLEVBQUUsRUFBRSxFQUFFLEVBQUUsT0FBTyxDQUFDLEVBQUUsRUFBRTtnQkFDekIsSUFBSSxFQUFFLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFO2FBQ2pDLENBQUMsQ0FBQTtZQUNGLGVBQWUsSUFBSSxDQUFDLENBQUE7WUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQywyQ0FBMkMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUE7UUFDekUsQ0FBQztRQUVELElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztZQUNwQyxLQUFLLE1BQU0sT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEVBQUUsQ0FBQztnQkFDdkMsSUFBSSxPQUFPLENBQUMsaUJBQWlCLEtBQUssS0FBSyxFQUFFLENBQUM7b0JBQ3hDLE1BQU0sYUFBYSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0QkFDckQsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFOzRCQUNkLGlCQUFpQixFQUFFLEtBQUs7eUJBQ3pCLENBQUMsQ0FBQyxDQUFBO29CQUNILGVBQWUsSUFBSSxDQUFDLENBQUE7b0JBQ3BCLE1BQU0sQ0FBQyxJQUFJLENBQ1QsNkNBQTZDLE9BQU8sQ0FBQyxLQUFLLElBQUksT0FBTyxDQUFDLEVBQUUsRUFBRSxDQUMzRSxDQUFBO2dCQUNILENBQUM7WUFDSCxDQUFDO1FBQ0gsQ0FBQztJQUNILENBQUM7SUFFRCw0RUFBNEU7SUFDNUUsK0RBQStEO0lBQy9ELHlCQUF5QjtJQUN6QixpQkFBaUI7SUFDakIsdUVBQXVFO0lBQ3ZFLDZFQUE2RTtJQUM3RSxNQUFNO0lBQ04sSUFBSTtJQUVKLE1BQU0sQ0FBQyxJQUFJLENBQ1QsK0JBQStCLGVBQWUsdUJBQXVCLGVBQWUsRUFBRSxDQUN2RixDQUFBO0lBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyx1REFBdUQsQ0FBQyxDQUFBO0FBQ3RFLENBQUMifQ==