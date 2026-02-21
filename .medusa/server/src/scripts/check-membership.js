"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = checkCollectionMembership;
const utils_1 = require("@medusajs/framework/utils");
async function checkCollectionMembership({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "handle", "collection_id", "collection.title"]
    });
    logger.info("Product Collection Membership:");
    products.forEach(p => {
        logger.info(`- ${p.title} (${p.handle}): Collection ID: ${p.collection_id}, Collection Title: ${p.collection?.title || 'None'}`);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2hlY2stbWVtYmVyc2hpcC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2NoZWNrLW1lbWJlcnNoaXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFHQSw0Q0FhQztBQWZELHFEQUFxRTtBQUV0RCxLQUFLLFVBQVUseUJBQXlCLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDN0UsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsT0FBTyxDQUFDLGlDQUF5QixDQUFDLEtBQUssQ0FBQyxDQUFBO0lBRWhFLE1BQU0sRUFBRSxJQUFJLEVBQUUsUUFBUSxFQUFFLEdBQUcsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDO1FBQzNDLE1BQU0sRUFBRSxTQUFTO1FBQ2pCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxFQUFFLGVBQWUsRUFBRSxrQkFBa0IsQ0FBQztLQUN2RSxDQUFDLENBQUE7SUFFRixNQUFNLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUE7SUFDN0MsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsRUFBRTtRQUNuQixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssS0FBSyxDQUFDLENBQUMsTUFBTSxxQkFBcUIsQ0FBQyxDQUFDLGFBQWEsdUJBQXVCLENBQUMsQ0FBQyxVQUFVLEVBQUUsS0FBSyxJQUFJLE1BQU0sRUFBRSxDQUFDLENBQUE7SUFDbEksQ0FBQyxDQUFDLENBQUE7QUFDSixDQUFDIn0=