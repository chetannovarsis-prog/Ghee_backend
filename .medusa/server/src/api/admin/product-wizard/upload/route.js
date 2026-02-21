"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
const image_to_product_wizard_1 = require("../../../../workflows/image-to-product-wizard");
async function POST(req, res) {
    // We expect multipart/form-data or json with base64 for simplicity in this MVP
    // If it's multipart, we'd need to parse it using something like busboy or multer
    // For now, let's assume JSON with base64 for the first pass to avoid adding heavy dependencies
    const { filename, fileContent } = req.body;
    if (!filename || !fileContent) {
        return res.status(400).json({
            message: "Missing filename or fileContent (base64)"
        });
    }
    try {
        const { result } = await (0, image_to_product_wizard_1.imageToProductWizardWorkflow)(req.scope)
            .run({
            input: {
                filename,
                fileContent
            },
        });
        res.status(200).json(result);
    }
    catch (error) {
        console.error("Workflow failed:", error);
        res.status(500).json({
            message: "Internal server error during image discovery",
            error: error.message
        });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3Byb2R1Y3Qtd2l6YXJkL3VwbG9hZC9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUdBLG9CQWlDQztBQW5DRCwyRkFBNEY7QUFFckYsS0FBSyxVQUFVLElBQUksQ0FDeEIsR0FBa0IsRUFDbEIsR0FBbUI7SUFFbkIsK0VBQStFO0lBQy9FLGlGQUFpRjtJQUNqRiwrRkFBK0Y7SUFFL0YsTUFBTSxFQUFFLFFBQVEsRUFBRSxXQUFXLEVBQUUsR0FBRyxHQUFHLENBQUMsSUFBVyxDQUFBO0lBRWpELElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUM5QixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1lBQzFCLE9BQU8sRUFBRSwwQ0FBMEM7U0FDcEQsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVELElBQUksQ0FBQztRQUNILE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxNQUFNLElBQUEsc0RBQTRCLEVBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQzthQUM3RCxHQUFHLENBQUM7WUFDSCxLQUFLLEVBQUU7Z0JBQ0wsUUFBUTtnQkFDUixXQUFXO2FBQ1o7U0FDRixDQUFDLENBQUE7UUFFSixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUM5QixDQUFDO0lBQUMsT0FBTyxLQUFLLEVBQUUsQ0FBQztRQUNmLE9BQU8sQ0FBQyxLQUFLLENBQUMsa0JBQWtCLEVBQUUsS0FBSyxDQUFDLENBQUE7UUFDeEMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDbkIsT0FBTyxFQUFFLDhDQUE4QztZQUN2RCxLQUFLLEVBQUUsS0FBSyxDQUFDLE9BQU87U0FDckIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztBQUNILENBQUMifQ==