"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
async function POST(req, res) {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    const cacheService = req.scope.resolve("cacheService");
    const storedOtp = await cacheService.get(`otp_${email}`);
    if (storedOtp === otp) {
        // Verify success - in a real app, you might generate a temporary token 
        // to authorize the actual password update.
        // For now, we'll just return success.
        res.status(200).json({ message: "OTP verified", success: true });
    }
    else {
        res.status(400).json({ message: "Invalid OTP", success: false });
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2F1dGgvb3RwL3ZlcmlmeS9yb3V0ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLG9CQXFCQztBQXJCTSxLQUFLLFVBQVUsSUFBSSxDQUN4QixHQUFrQixFQUNsQixHQUFtQjtJQUVuQixNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUFzQyxDQUFBO0lBRWpFLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUNuQixPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLDRCQUE0QixFQUFFLENBQUMsQ0FBQTtJQUN4RSxDQUFDO0lBRUQsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFRLENBQUE7SUFDN0QsTUFBTSxTQUFTLEdBQUcsTUFBTSxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sS0FBSyxFQUFFLENBQUMsQ0FBQTtJQUV4RCxJQUFJLFNBQVMsS0FBSyxHQUFHLEVBQUUsQ0FBQztRQUN0Qix3RUFBd0U7UUFDeEUsMkNBQTJDO1FBQzNDLHNDQUFzQztRQUN0QyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxjQUFjLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUE7SUFDbEUsQ0FBQztTQUFNLENBQUM7UUFDTixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUsT0FBTyxFQUFFLEtBQUssRUFBRSxDQUFDLENBQUE7SUFDbEUsQ0FBQztBQUNILENBQUMifQ==