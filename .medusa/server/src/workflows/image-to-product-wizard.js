"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.imageToProductWizardWorkflow = void 0;
const workflows_sdk_1 = require("@medusajs/framework/workflows-sdk");
const utils_1 = require("@medusajs/framework/utils");
const uploadImageStep = (0, workflows_sdk_1.createStep)("upload-image-step", async (input, { container }) => {
    const fileModuleService = container.resolve(utils_1.Modules.FILE);
    // In a real scenario, we'd handle the base64 or buffer properly
    // For now, we simulate the upload or use the local file service if configured
    const file = await fileModuleService.createFiles({
        filename: input.filename,
        mimeType: "image/jpeg", // Simplified
        content: input.fileContent
    });
    return new workflows_sdk_1.StepResponse(file);
});
const discoverProductDetailsStep = (0, workflows_sdk_1.createStep)("discover-product-details-step", async (input) => {
    // This is where AI logic would go to extract details from the image
    // For now, we return mock "discovered" data with ghee-specific attributes
    // In a real implementation, this would use AI vision API to:
    // - Read product labels for purity percentage
    // - Detect cow breed mentions (Gir, Buffalo, Sahiwal, etc.)
    // - Identify processing methods (Bilona, Traditional, Vedic)
    // - Extract origin information from text
    // - Detect certification badges (Organic, etc.)
    // - Identify packaging type from image
    const mockDetails = {
        title: "Pure A2 Gir Cow Ghee",
        description: "Traditional Bilona-churned ghee from grass-fed Gir cows. Rich in nutrients and authentic Ayurvedic wellness.",
        handle: "a2-gir-ghee-" + Math.random().toString(36).substring(7),
        price: 1250, // default price in paise (₹12.50)
        // Ghee-specific metadata extracted from image
        metadata: {
            purity_percentage: 99.5,
            cow_breed: "Gir",
            processing_method: "Bilona",
            origin: "Gujarat",
            packaging_type: "Glass Jar",
            grass_fed: true,
            organic_certified: true,
            shelf_life_months: 12,
            rating: 4.8,
            reviews_count: 0,
            badge: "Premium Quality"
        }
    };
    return new workflows_sdk_1.StepResponse(mockDetails);
});
exports.imageToProductWizardWorkflow = (0, workflows_sdk_1.createWorkflow)("image-to-product-wizard", (input) => {
    const file = uploadImageStep(input);
    const details = discoverProductDetailsStep({ url: file.url });
    return new workflows_sdk_1.WorkflowResponse({
        file,
        details
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW1hZ2UtdG8tcHJvZHVjdC13aXphcmQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9zcmMvd29ya2Zsb3dzL2ltYWdlLXRvLXByb2R1Y3Qtd2l6YXJkLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHFFQUswQztBQUMxQyxxREFBbUQ7QUFFbkQsTUFBTSxlQUFlLEdBQUcsSUFBQSwwQkFBVSxFQUNoQyxtQkFBbUIsRUFDbkIsS0FBSyxFQUFFLEtBQWdELEVBQUUsRUFBRSxTQUFTLEVBQUUsRUFBRSxFQUFFO0lBQ3hFLE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsSUFBSSxDQUFDLENBQUE7SUFFekQsZ0VBQWdFO0lBQ2hFLDhFQUE4RTtJQUM5RSxNQUFNLElBQUksR0FBRyxNQUFNLGlCQUFpQixDQUFDLFdBQVcsQ0FBQztRQUMvQyxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7UUFDeEIsUUFBUSxFQUFFLFlBQVksRUFBRSxhQUFhO1FBQ3JDLE9BQU8sRUFBRSxLQUFLLENBQUMsV0FBVztLQUMzQixDQUFDLENBQUE7SUFFRixPQUFPLElBQUksNEJBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQTtBQUMvQixDQUFDLENBQ0YsQ0FBQTtBQUVELE1BQU0sMEJBQTBCLEdBQUcsSUFBQSwwQkFBVSxFQUMzQywrQkFBK0IsRUFDL0IsS0FBSyxFQUFFLEtBQXNCLEVBQUUsRUFBRTtJQUMvQixvRUFBb0U7SUFDcEUsMEVBQTBFO0lBRTFFLDZEQUE2RDtJQUM3RCw4Q0FBOEM7SUFDOUMsNERBQTREO0lBQzVELDZEQUE2RDtJQUM3RCx5Q0FBeUM7SUFDekMsZ0RBQWdEO0lBQ2hELHVDQUF1QztJQUV2QyxNQUFNLFdBQVcsR0FBRztRQUNsQixLQUFLLEVBQUUsc0JBQXNCO1FBQzdCLFdBQVcsRUFBRSw4R0FBOEc7UUFDM0gsTUFBTSxFQUFFLGNBQWMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDaEUsS0FBSyxFQUFFLElBQUksRUFBRSxrQ0FBa0M7UUFFL0MsOENBQThDO1FBQzlDLFFBQVEsRUFBRTtZQUNSLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsU0FBUyxFQUFFLEtBQUs7WUFDaEIsaUJBQWlCLEVBQUUsUUFBUTtZQUMzQixNQUFNLEVBQUUsU0FBUztZQUNqQixjQUFjLEVBQUUsV0FBVztZQUMzQixTQUFTLEVBQUUsSUFBSTtZQUNmLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsaUJBQWlCLEVBQUUsRUFBRTtZQUNyQixNQUFNLEVBQUUsR0FBRztZQUNYLGFBQWEsRUFBRSxDQUFDO1lBQ2hCLEtBQUssRUFBRSxpQkFBaUI7U0FDekI7S0FDRixDQUFBO0lBRUQsT0FBTyxJQUFJLDRCQUFZLENBQUMsV0FBVyxDQUFDLENBQUE7QUFDdEMsQ0FBQyxDQUNGLENBQUE7QUFFWSxRQUFBLDRCQUE0QixHQUFHLElBQUEsOEJBQWMsRUFDeEQseUJBQXlCLEVBQ3pCLENBQUMsS0FBZ0QsRUFBRSxFQUFFO0lBQ25ELE1BQU0sSUFBSSxHQUFHLGVBQWUsQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNuQyxNQUFNLE9BQU8sR0FBRywwQkFBMEIsQ0FBQyxFQUFFLEdBQUcsRUFBRSxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQTtJQUU3RCxPQUFPLElBQUksZ0NBQWdCLENBQUM7UUFDMUIsSUFBSTtRQUNKLE9BQU87S0FDUixDQUFDLENBQUE7QUFDSixDQUFDLENBQ0YsQ0FBQSJ9