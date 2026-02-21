"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = generateDiag;
const utils_1 = require("@medusajs/framework/utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
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
    const filePath = path_1.default.join(process.cwd(), "diag_final.json");
    fs_1.default.writeFileSync(filePath, JSON.stringify(report, null, 2));
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGUtZGlhZy1maW5hbC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL2dlbmVyYXRlLWRpYWctZmluYWwudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFLQSwrQkEyQkM7QUEvQkQscURBQXFFO0FBQ3JFLDRDQUFtQjtBQUNuQixnREFBdUI7QUFFUixLQUFLLFVBQVUsWUFBWSxDQUFDLEVBQUUsU0FBUyxFQUFZO0lBQ2hFLE1BQU0sS0FBSyxHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsaUNBQXlCLENBQUMsS0FBSyxDQUFDLENBQUE7SUFFaEUsTUFBTSxFQUFFLElBQUksRUFBRSxRQUFRLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDM0MsTUFBTSxFQUFFLFNBQVM7UUFDakIsTUFBTSxFQUFFLENBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsa0JBQWtCLEVBQUUscUJBQXFCLENBQUM7S0FDN0UsQ0FBQyxDQUFBO0lBRUYsTUFBTSxFQUFFLElBQUksRUFBRSxXQUFXLEVBQUUsR0FBRyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUM7UUFDOUMsTUFBTSxFQUFFLG9CQUFvQjtRQUM1QixNQUFNLEVBQUUsQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLFFBQVEsQ0FBQztLQUNsQyxDQUFDLENBQUE7SUFFRixNQUFNLE1BQU0sR0FBRztRQUNiLFlBQVksRUFBRSxRQUFRLENBQUMsTUFBTTtRQUM3QixlQUFlLEVBQUUsV0FBVyxDQUFDLE1BQU07UUFDbkMsUUFBUSxFQUFFLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQzNCLEtBQUssRUFBRSxDQUFDLENBQUMsS0FBSztZQUNkLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTTtZQUNoQixVQUFVLEVBQUUsQ0FBQyxDQUFDLFVBQVUsRUFBRSxLQUFLO1lBQy9CLGNBQWMsRUFBRSxDQUFDLENBQUMsY0FBYyxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUcsQ0FBQyxJQUFJLENBQUM7U0FDdEQsQ0FBQyxDQUFDO1FBQ0gsV0FBVyxFQUFFLFdBQVc7S0FDekIsQ0FBQTtJQUVELE1BQU0sUUFBUSxHQUFHLGNBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsRUFBRSxFQUFFLGlCQUFpQixDQUFDLENBQUE7SUFDNUQsWUFBRSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0QsQ0FBQyJ9