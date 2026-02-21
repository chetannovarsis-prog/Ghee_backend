"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = renameWarehouse;
const utils_1 = require("@medusajs/framework/utils");
const fs = __importStar(require("fs"));
async function renameWarehouse({ container }) {
    const logger = container.resolve(utils_1.ContainerRegistrationKeys.LOGGER);
    const stockLocationModule = container.resolve(utils_1.Modules.STOCK_LOCATION);
    const fulfillmentModule = container.resolve(utils_1.Modules.FULFILLMENT);
    logger.info("Starting Warehouse Renaming...");
    try {
        const allLocations = await stockLocationModule.listStockLocations({});
        const allSets = await fulfillmentModule.listFulfillmentSets({}, { relations: ["service_zones"] });
        fs.writeFileSync("rename_debug.json", JSON.stringify({ allLocations, allSets }, null, 2));
        // 1. Rename Stock Location
        const sloc = allLocations.find(l => l.name === "European Warehouse");
        if (sloc) {
            await stockLocationModule.updateStockLocations(sloc.id, {
                name: "India Warehouse",
            });
            logger.info(`Renamed Stock Location ${sloc.id} to "India Warehouse"`);
        }
        else {
            logger.info('Stock Location "European Warehouse" not found.');
        }
        // 2. Rename Fulfillment Set and Service Zones
        const targetFS = allSets.find(fs => fs.name?.toLowerCase().includes("european") || fs.name?.toLowerCase().includes("india"));
        if (targetFS) {
            if (targetFS.name !== "India Warehouse delivery") {
                await fulfillmentModule.updateFulfillmentSets({
                    id: targetFS.id,
                    name: "India Warehouse delivery",
                });
                logger.info(`Renamed Fulfillment Set ${targetFS.id} to "India Warehouse delivery"`);
            }
            if (targetFS.service_zones) {
                for (const zone of targetFS.service_zones) {
                    if (zone.name === "Europe") {
                        await fulfillmentModule.deleteServiceZones(zone.id);
                        logger.info(`Deleted Service Zone "Europe" (${zone.id})`);
                    }
                    else if (zone.name === "India") {
                        // Ensure it's named India (it already is)
                        logger.info(`Service Zone "India" already exists (${zone.id})`);
                    }
                }
            }
        }
        else {
            logger.info('Fulfillment Set containing "European" or "India" not found.');
        }
        logger.info("Warehouse Renaming COMPLETE!");
    }
    catch (err) {
        logger.error(`Error during Warehouse Renaming: ${err.message}`);
        throw err;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmVuYW1lLXdhcmVob3VzZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9zY3JpcHRzL3JlbmFtZS13YXJlaG91c2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFLQSxrQ0F5REM7QUE3REQscURBQThFO0FBRTlFLHVDQUF3QjtBQUVULEtBQUssVUFBVSxlQUFlLENBQUMsRUFBRSxTQUFTLEVBQVk7SUFDbkUsTUFBTSxNQUFNLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxpQ0FBeUIsQ0FBQyxNQUFNLENBQUMsQ0FBQTtJQUNsRSxNQUFNLG1CQUFtQixHQUFHLFNBQVMsQ0FBQyxPQUFPLENBQUMsZUFBTyxDQUFDLGNBQWMsQ0FBQyxDQUFBO0lBQ3JFLE1BQU0saUJBQWlCLEdBQUcsU0FBUyxDQUFDLE9BQU8sQ0FBQyxlQUFPLENBQUMsV0FBVyxDQUFDLENBQUE7SUFFaEUsTUFBTSxDQUFDLElBQUksQ0FBQyxnQ0FBZ0MsQ0FBQyxDQUFBO0lBRTdDLElBQUksQ0FBQztRQUNILE1BQU0sWUFBWSxHQUFHLE1BQU0sbUJBQW1CLENBQUMsa0JBQWtCLENBQUMsRUFBRSxDQUFDLENBQUE7UUFDckUsTUFBTSxPQUFPLEdBQUcsTUFBTSxpQkFBaUIsQ0FBQyxtQkFBbUIsQ0FBQyxFQUFFLEVBQUUsRUFBRSxTQUFTLEVBQUUsQ0FBQyxlQUFlLENBQUMsRUFBRSxDQUFDLENBQUE7UUFFakcsRUFBRSxDQUFDLGFBQWEsQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBRXpGLDJCQUEyQjtRQUMzQixNQUFNLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksS0FBSyxvQkFBb0IsQ0FBQyxDQUFBO1FBRXBFLElBQUksSUFBSSxFQUFFLENBQUM7WUFDVCxNQUFNLG1CQUFtQixDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxFQUFFLEVBQUU7Z0JBQ3RELElBQUksRUFBRSxpQkFBaUI7YUFDeEIsQ0FBQyxDQUFBO1lBQ0YsTUFBTSxDQUFDLElBQUksQ0FBQywwQkFBMEIsSUFBSSxDQUFDLEVBQUUsdUJBQXVCLENBQUMsQ0FBQTtRQUN2RSxDQUFDO2FBQU0sQ0FBQztZQUNOLE1BQU0sQ0FBQyxJQUFJLENBQUMsZ0RBQWdELENBQUMsQ0FBQTtRQUMvRCxDQUFDO1FBRUQsOENBQThDO1FBQzlDLE1BQU0sUUFBUSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFBO1FBRTVILElBQUksUUFBUSxFQUFFLENBQUM7WUFDYixJQUFJLFFBQVEsQ0FBQyxJQUFJLEtBQUssMEJBQTBCLEVBQUUsQ0FBQztnQkFDakQsTUFBTSxpQkFBaUIsQ0FBQyxxQkFBcUIsQ0FBQztvQkFDNUMsRUFBRSxFQUFFLFFBQVEsQ0FBQyxFQUFFO29CQUNmLElBQUksRUFBRSwwQkFBMEI7aUJBQ2pDLENBQUMsQ0FBQTtnQkFDRixNQUFNLENBQUMsSUFBSSxDQUFDLDJCQUEyQixRQUFRLENBQUMsRUFBRSxnQ0FBZ0MsQ0FBQyxDQUFBO1lBQ3JGLENBQUM7WUFFRCxJQUFJLFFBQVEsQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDM0IsS0FBSyxNQUFNLElBQUksSUFBSSxRQUFRLENBQUMsYUFBYSxFQUFFLENBQUM7b0JBQzFDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxRQUFRLEVBQUUsQ0FBQzt3QkFDM0IsTUFBTSxpQkFBaUIsQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7d0JBQ25ELE1BQU0sQ0FBQyxJQUFJLENBQUMsa0NBQWtDLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFBO29CQUMzRCxDQUFDO3lCQUFNLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxPQUFPLEVBQUUsQ0FBQzt3QkFDaEMsMENBQTBDO3dCQUMxQyxNQUFNLENBQUMsSUFBSSxDQUFDLHdDQUF3QyxJQUFJLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQTtvQkFDbEUsQ0FBQztnQkFDSCxDQUFDO1lBQ0gsQ0FBQztRQUNILENBQUM7YUFBTSxDQUFDO1lBQ04sTUFBTSxDQUFDLElBQUksQ0FBQyw2REFBNkQsQ0FBQyxDQUFBO1FBQzVFLENBQUM7UUFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLDhCQUE4QixDQUFDLENBQUE7SUFDN0MsQ0FBQztJQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDYixNQUFNLENBQUMsS0FBSyxDQUFDLG9DQUFvQyxHQUFHLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQTtRQUMvRCxNQUFNLEdBQUcsQ0FBQTtJQUNYLENBQUM7QUFDSCxDQUFDIn0=