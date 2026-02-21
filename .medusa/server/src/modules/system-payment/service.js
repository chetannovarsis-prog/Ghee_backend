"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("@medusajs/framework/utils");
const crypto_1 = __importDefault(require("crypto"));
console.log("Loading ManualPaymentProvider Service file");
class ManualPaymentProvider extends utils_1.AbstractPaymentProvider {
    async getStatus(_) {
        return "authorized";
    }
    async getPaymentData(_) {
        return {};
    }
    async initiatePayment(input) {
        return { data: {}, id: crypto_1.default.randomUUID() };
    }
    async getPaymentStatus(input) {
        return { status: "authorized" };
    }
    async retrievePayment(input) {
        return {};
    }
    async authorizePayment(input) {
        return { data: {}, status: utils_1.PaymentSessionStatus.AUTHORIZED };
    }
    async updatePayment(input) {
        return { data: {} };
    }
    async deletePayment(input) {
        return { data: {} };
    }
    async capturePayment(input) {
        return { data: {} };
    }
    async retrieveAccountHolder(input) {
        return { id: input.id };
    }
    async createAccountHolder(input) {
        return { id: input.context.customer.id };
    }
    async deleteAccountHolder(input) {
        return { data: {} };
    }
    async refundPayment(input) {
        return { data: {} };
    }
    async cancelPayment(input) {
        return { data: {} };
    }
    async getWebhookActionAndData(data) {
        return { action: utils_1.PaymentActions.NOT_SUPPORTED };
    }
}
ManualPaymentProvider.identifier = "manual";
exports.default = ManualPaymentProvider;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9tb2R1bGVzL3N5c3RlbS1wYXltZW50L3NlcnZpY2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFDQSxxREFJa0M7QUF3QmxDLG9EQUEyQjtBQUUzQixPQUFPLENBQUMsR0FBRyxDQUFDLDRDQUE0QyxDQUFDLENBQUE7QUFFekQsTUFBTSxxQkFBc0IsU0FBUSwrQkFBdUI7SUFHekQsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFNO1FBQ3BCLE9BQU8sWUFBWSxDQUFBO0lBQ3JCLENBQUM7SUFFRCxLQUFLLENBQUMsY0FBYyxDQUFDLENBQU07UUFDekIsT0FBTyxFQUFFLENBQUE7SUFDWCxDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUEyQjtRQUMvQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxFQUFFLEVBQUUsZ0JBQU0sQ0FBQyxVQUFVLEVBQUUsRUFBRSxDQUFBO0lBQzlDLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBNEI7UUFDakQsT0FBTyxFQUFFLE1BQU0sRUFBRSxZQUFZLEVBQUUsQ0FBQTtJQUNqQyxDQUFDO0lBRUQsS0FBSyxDQUFDLGVBQWUsQ0FBQyxLQUEyQjtRQUMvQyxPQUFPLEVBQUUsQ0FBQTtJQUNYLENBQUM7SUFFRCxLQUFLLENBQUMsZ0JBQWdCLENBQUMsS0FBNEI7UUFDakQsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLDRCQUFvQixDQUFDLFVBQVUsRUFBRSxDQUFBO0lBQzlELENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQXlCO1FBQzNDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUE7SUFDckIsQ0FBQztJQUVELEtBQUssQ0FBQyxhQUFhLENBQUMsS0FBeUI7UUFDM0MsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQTtJQUNyQixDQUFDO0lBRUQsS0FBSyxDQUFDLGNBQWMsQ0FBQyxLQUEwQjtRQUM3QyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFBO0lBQ3JCLENBQUM7SUFFRCxLQUFLLENBQUMscUJBQXFCLENBQUMsS0FBVTtRQUNwQyxPQUFPLEVBQUUsRUFBRSxFQUFFLEtBQUssQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUN6QixDQUFDO0lBRUQsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQVU7UUFDbEMsT0FBTyxFQUFFLEVBQUUsRUFBRSxLQUFLLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxFQUFFLEVBQUUsQ0FBQTtJQUMxQyxDQUFDO0lBRUQsS0FBSyxDQUFDLG1CQUFtQixDQUFDLEtBQVU7UUFDbEMsT0FBTyxFQUFFLElBQUksRUFBRSxFQUFFLEVBQUUsQ0FBQTtJQUNyQixDQUFDO0lBRUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxLQUF5QjtRQUMzQyxPQUFPLEVBQUUsSUFBSSxFQUFFLEVBQUUsRUFBRSxDQUFBO0lBQ3JCLENBQUM7SUFFRCxLQUFLLENBQUMsYUFBYSxDQUFDLEtBQXlCO1FBQzNDLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBRSxFQUFFLENBQUE7SUFDckIsQ0FBQztJQUVELEtBQUssQ0FBQyx1QkFBdUIsQ0FBQyxJQUF1QztRQUNuRSxPQUFPLEVBQUUsTUFBTSxFQUFFLHNCQUFjLENBQUMsYUFBYSxFQUFFLENBQUE7SUFDakQsQ0FBQzs7QUE1RE0sZ0NBQVUsR0FBRyxRQUFRLENBQUE7QUErRDlCLGtCQUFlLHFCQUFxQixDQUFBIn0=