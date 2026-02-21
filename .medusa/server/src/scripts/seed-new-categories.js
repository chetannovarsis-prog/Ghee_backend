"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = seedNewCategories;
const utils_1 = require("@medusajs/framework/utils");
const core_flows_1 = require("@medusajs/medusa/core-flows");
async function seedNewCategories({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    logger.info("Seeding Men and Women categories...");
    try {
        const { result: categoryResult } = await (0, core_flows_1.createProductCategoriesWorkflow)(container).run({
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
    }
    catch (error) {
        logger.error(`Failed to seed categories: ${error.message}`);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VlZC1uZXctY2F0ZWdvcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3NlZWQtbmV3LWNhdGVnb3JpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxvQ0E0Q0M7QUEvQ0QscURBQXNFO0FBQ3RFLDREQUE4RTtBQUUvRCxLQUFLLFVBQVUsaUJBQWlCLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDckUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUVuRSxNQUFNLENBQUMsSUFBSSxDQUFDLHFDQUFxQyxDQUFDLENBQUM7SUFFbkQsSUFBSSxDQUFDO1FBQ0gsTUFBTSxFQUFFLE1BQU0sRUFBRSxjQUFjLEVBQUUsR0FBRyxNQUFNLElBQUEsNENBQStCLEVBQ3RFLFNBQVMsQ0FDVixDQUFDLEdBQUcsQ0FBQztZQUNKLEtBQUssRUFBRTtnQkFDTCxrQkFBa0IsRUFBRTtvQkFDbEI7d0JBQ0UsSUFBSSxFQUFFLEtBQUs7d0JBQ1gsTUFBTSxFQUFFLEtBQUs7d0JBQ2IsU0FBUyxFQUFFLElBQUk7cUJBQ2hCO29CQUNEO3dCQUNFLElBQUksRUFBRSxPQUFPO3dCQUNiLE1BQU0sRUFBRSxPQUFPO3dCQUNmLFNBQVMsRUFBRSxJQUFJO3FCQUNoQjtvQkFDRDt3QkFDRSxJQUFJLEVBQUUsTUFBTTt3QkFDWixNQUFNLEVBQUUsTUFBTTt3QkFDZCxTQUFTLEVBQUUsSUFBSTtxQkFDaEI7b0JBQ0Q7d0JBQ0UsSUFBSSxFQUFFLE1BQU07d0JBQ1osTUFBTSxFQUFFLE1BQU07d0JBQ2QsU0FBUyxFQUFFLElBQUk7cUJBQ2hCO29CQUNEO3dCQUNFLElBQUksRUFBRSxRQUFRO3dCQUNkLE1BQU0sRUFBRSxRQUFRO3dCQUNoQixTQUFTLEVBQUUsSUFBSTtxQkFDaEI7aUJBQ0Y7YUFDRjtTQUNGLENBQUMsQ0FBQztRQUVILE1BQU0sQ0FBQyxJQUFJLENBQUMsdUJBQXVCLGNBQWMsQ0FBQyxNQUFNLGNBQWMsQ0FBQyxDQUFDO0lBQzFFLENBQUM7SUFBQyxPQUFPLEtBQUssRUFBRSxDQUFDO1FBQ2YsTUFBTSxDQUFDLEtBQUssQ0FBQyw4QkFBOEIsS0FBSyxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDOUQsQ0FBQztBQUNILENBQUMifQ==