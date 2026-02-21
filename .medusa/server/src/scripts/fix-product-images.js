"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = fixProductImages;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function fixProductImages({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    logger.info("Fixing product images with refreshed Unsplash URLs...");
    const productImagesMap = {
        "haldhar-jowar-atta": "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000&auto=format&fit=crop",
        "haldhar-multi-grain-atta": "https://images.unsplash.com/photo-1598971861713-54ad16a7e72e?q=80&w=1000&auto=format&fit=crop",
        "haldhar-whole-wheat-atta": "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?q=80&w=1000&auto=format&fit=crop",
        "haldhar-moringa-sattu-mix": "https://images.unsplash.com/photo-1515023115689-589c33041d3c?q=80&w=1000&auto=format&fit=crop",
        "gousaaram-goumutra-capsules": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=1000&auto=format&fit=crop",
        "haldhar-sattu-mix": "https://images.unsplash.com/photo-1615485290382-441e4d0c9cb5?q=80&w=1000&auto=format&fit=crop",
        "haldhar-moong-multigrain-atta": "https://images.unsplash.com/photo-1515544832961-29243da5955f?q=80&w=1000&auto=format&fit=crop"
    };
    try {
        const { data: products } = await query.graph({
            entity: "product",
            fields: ["id", "handle"]
        });
        const updates = [];
        for (const product of products) {
            if (productImagesMap[product.handle]) {
                updates.push({
                    id: product.id,
                    thumbnail: productImagesMap[product.handle],
                    images: [{ url: productImagesMap[product.handle] }]
                });
            }
        }
        if (updates.length > 0) {
            await (0, core_flows_1.updateProductsWorkflow)(container).run({
                input: {
                    products: updates
                }
            });
            logger.info(`SUCCESS: Updated images for ${updates.length} products.`);
        }
        else {
            logger.info("No products found to update.");
        }
    }
    catch (error) {
        logger.error(`Update failed: ${error.message}`);
        console.error(error);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZml4LXByb2R1Y3QtaW1hZ2VzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL3NjcmlwdHMvZml4LXByb2R1Y3QtaW1hZ2VzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBSUEsbUNBZ0RDO0FBbkRELHFEQUE4RTtBQUM5RSw0REFBb0U7QUFFckQsS0FBSyxVQUFVLGdCQUFnQixDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ3BFLE1BQU0sTUFBTSxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDbEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVoRSxNQUFNLENBQUMsSUFBSSxDQUFDLHVEQUF1RCxDQUFDLENBQUE7SUFFcEUsTUFBTSxnQkFBZ0IsR0FBMkI7UUFDL0Msb0JBQW9CLEVBQUUsK0ZBQStGO1FBQ3JILDBCQUEwQixFQUFFLCtGQUErRjtRQUMzSCwwQkFBMEIsRUFBRSwrRkFBK0Y7UUFDM0gsMkJBQTJCLEVBQUUsK0ZBQStGO1FBQzVILDZCQUE2QixFQUFFLCtGQUErRjtRQUM5SCxtQkFBbUIsRUFBRSwrRkFBK0Y7UUFDcEgsK0JBQStCLEVBQUUsK0ZBQStGO0tBQ2pJLENBQUE7SUFFRCxJQUFJLENBQUM7UUFDSCxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztZQUMzQyxNQUFNLEVBQUUsU0FBUztZQUNqQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsUUFBUSxDQUFDO1NBQ3pCLENBQUMsQ0FBQTtRQUVGLE1BQU0sT0FBTyxHQUFVLEVBQUUsQ0FBQTtRQUN6QixLQUFLLE1BQU0sT0FBTyxJQUFJLFFBQVEsRUFBRSxDQUFDO1lBQy9CLElBQUksZ0JBQWdCLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7Z0JBQ3JDLE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQ1gsRUFBRSxFQUFFLE9BQU8sQ0FBQyxFQUFFO29CQUNkLFNBQVMsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDO29CQUMzQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxnQkFBZ0IsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQztpQkFDcEQsQ0FBQyxDQUFBO1lBQ0osQ0FBQztRQUNILENBQUM7UUFFRCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFLENBQUM7WUFDdkIsTUFBTSxJQUFBLG1DQUFzQixFQUFDLFNBQVMsQ0FBQyxDQUFDLEdBQUcsQ0FBQztnQkFDMUMsS0FBSyxFQUFFO29CQUNMLFFBQVEsRUFBRSxPQUFPO2lCQUNsQjthQUNGLENBQUMsQ0FBQTtZQUNGLE1BQU0sQ0FBQyxJQUFJLENBQUMsK0JBQStCLE9BQU8sQ0FBQyxNQUFNLFlBQVksQ0FBQyxDQUFBO1FBQ3hFLENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyw4QkFBOEIsQ0FBQyxDQUFBO1FBQzdDLENBQUM7SUFFSCxDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE1BQU0sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFBO1FBQy9DLE9BQU8sQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDdEIsQ0FBQztBQUNILENBQUMifQ==