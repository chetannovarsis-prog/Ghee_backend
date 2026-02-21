"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateDiag;
const utils_1 = require("@medusajs/framework/utils");
const fs_1 = __importDefault(require("fs"));
async function generateDiag({ container }) {
    const query = container.resolve(utils_1.ContainerRegistrationKeys.QUERY);
    const { data: products } = await query.graph({
        entity: "product",
        fields: ["id", "title", "status", "collection.title", "sales_channels.name"]
    });
    const { data: collections } = await query.graph({
        entity: "product_collection",
        fields: ["id", "title", "handle"]
    });
    const report = {
        productCount: products.length,
        collectionCount: collections.length,
        products: products.map(p => ({
            title: p.title,
            status: p.status,
            collection: p.collection?.title,
            sales_channels: p.sales_channels?.map(sc => sc.name)
        })),
        collections: collections
    };
    fs_1.default.writeFileSync("diag.json", JSON.stringify(report, null, 2));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtZGlhZy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2dlbmVyYXRlLWRpYWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJQSwrQkEwQkM7QUE3QkQscURBQXFFO0FBQ3JFLDRDQUFtQjtBQUVKLEtBQUssVUFBVSxZQUFZLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDaEUsTUFBTSxLQUFLLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUVoRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFFBQVEsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUMzQyxNQUFNLEVBQUUsU0FBUztRQUNqQixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxrQkFBa0IsRUFBRSxxQkFBcUIsQ0FBQztLQUM3RSxDQUFDLENBQUE7SUFFRixNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxHQUFHLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQztRQUM5QyxNQUFNLEVBQUUsb0JBQW9CO1FBQzVCLE1BQU0sRUFBRSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsUUFBUSxDQUFDO0tBQ2xDLENBQUMsQ0FBQTtJQUVGLE1BQU0sTUFBTSxHQUFHO1FBQ2IsWUFBWSxFQUFFLFFBQVEsQ0FBQyxNQUFNO1FBQzdCLGVBQWUsRUFBRSxXQUFXLENBQUMsTUFBTTtRQUNuQyxRQUFRLEVBQUUsUUFBUSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDM0IsS0FBSyxFQUFFLENBQUMsQ0FBQyxLQUFLO1lBQ2QsTUFBTSxFQUFFLENBQUMsQ0FBQyxNQUFNO1lBQ2hCLFVBQVUsRUFBRSxDQUFDLENBQUMsVUFBVSxFQUFFLEtBQUs7WUFDL0IsY0FBYyxFQUFFLENBQUMsQ0FBQyxjQUFjLEVBQUUsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRyxDQUFDLElBQUksQ0FBQztTQUN0RCxDQUFDLENBQUM7UUFDSCxXQUFXLEVBQUUsV0FBVztLQUN6QixDQUFBO0lBRUQsWUFBRSxDQUFDLGFBQWEsQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDaEUsQ0FBQyJ9