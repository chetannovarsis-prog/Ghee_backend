"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("./src/modules/razorpay/index"));
console.log("Module type:", typeof index_1.default);
console.log("Module value:", index_1.default);
console.log("Is array:", Array.isArray(index_1.default));
console.log("Services property:", index_1.default?.services);
console.log("Is services array:", Array.isArray(index_1.default?.services));
if (Array.isArray(index_1.default)) {
    console.log("Iteration over mod:");
    for (const s of index_1.default) {
        console.log(" -", s.name || s.identifier || s);
    }
}
else if (index_1.default?.services && Array.isArray(index_1.default.services)) {
    console.log("Iteration over mod.services:");
    for (const s of index_1.default.services) {
        console.log(" -", s.name || s.identifier || s);
    }
}
else {
    console.log("NOT ITERABLE in expected ways");
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVidWctZXhwb3J0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vZGVidWctZXhwb3J0LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O0FBQ0EseUVBQThDO0FBRzlDLE9BQU8sQ0FBQyxHQUFHLENBQUMsY0FBYyxFQUFFLE9BQU8sZUFBRyxDQUFDLENBQUE7QUFDdkMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsZUFBRyxDQUFDLENBQUE7QUFDakMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFXLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFHLENBQUMsQ0FBQyxDQUFBO0FBQzVDLE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsZUFBRyxFQUFFLFFBQVEsQ0FBQyxDQUFBO0FBQ2hELE9BQU8sQ0FBQyxHQUFHLENBQUMsb0JBQW9CLEVBQUUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFHLEVBQUUsUUFBUSxDQUFDLENBQUMsQ0FBQTtBQUUvRCxJQUFJLEtBQUssQ0FBQyxPQUFPLENBQUMsZUFBRyxDQUFDLEVBQUUsQ0FBQztJQUNyQixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUE7SUFDbEMsS0FBSyxNQUFNLENBQUMsSUFBSSxlQUFHLEVBQUUsQ0FBQztRQUNsQixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUMsQ0FBQyxVQUFVLElBQUksQ0FBQyxDQUFDLENBQUE7SUFDbEQsQ0FBQztBQUNMLENBQUM7S0FBTSxJQUFJLGVBQUcsRUFBRSxRQUFRLElBQUksS0FBSyxDQUFDLE9BQU8sQ0FBQyxlQUFHLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQztJQUN0RCxPQUFPLENBQUMsR0FBRyxDQUFDLDhCQUE4QixDQUFDLENBQUE7SUFDM0MsS0FBSyxNQUFNLENBQUMsSUFBSSxlQUFHLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLElBQUksSUFBSSxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsQ0FBQyxDQUFBO0lBQ2xELENBQUM7QUFDTCxDQUFDO0tBQU0sQ0FBQztJQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsK0JBQStCLENBQUMsQ0FBQTtBQUNoRCxDQUFDIn0=