"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailNotificationsModule = void 0;
const utils_1 = require("@medusajs/framework/utils");
const resend_provider_1 = __importDefault(require("./services/resend-provider"));
exports.EmailNotificationsModule = "email_notifications";
exports.default = (0, utils_1.Module)(exports.EmailNotificationsModule, {
    service: resend_provider_1.default,
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9lbWFpbF9ub3RpZmljYXRpb25zL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBLHFEQUFrRDtBQUNsRCxpRkFBa0U7QUFFckQsUUFBQSx3QkFBd0IsR0FBRyxxQkFBcUIsQ0FBQTtBQUU3RCxrQkFBZSxJQUFBLGNBQU0sRUFBQyxnQ0FBd0IsRUFBRTtJQUM5QyxPQUFPLEVBQUUseUJBQXlCO0NBQ25DLENBQUMsQ0FBQSJ9