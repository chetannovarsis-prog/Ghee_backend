"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = POST;
async function POST(req, res) {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store OTP in cache with 10-minute expiry
    // Using Medusa's cache service if available, or just a temporary store
    const cacheService = req.scope.resolve("cacheService");
    await cacheService.set(`otp_${email}`, otp, 600);
    console.log(`[OTP] Generated for ${email}: ${otp}`);
    // In a real app, send email here
    // For now, we simulate sending to ansupal001@gmail.com
    // if (email === "ansupal001@gmail.com") { ... }
    res.status(200).json({ message: "OTP sent successfully" });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL3N0b3JlL2F1dGgvb3RwL3JlcXVlc3Qvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFFQSxvQkF5QkM7QUF6Qk0sS0FBSyxVQUFVLElBQUksQ0FDeEIsR0FBa0IsRUFDbEIsR0FBbUI7SUFFbkIsTUFBTSxFQUFFLEtBQUssRUFBRSxHQUFHLEdBQUcsQ0FBQyxJQUF5QixDQUFBO0lBRS9DLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNYLE9BQU8sR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsRUFBRSxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsQ0FBQyxDQUFBO0lBQy9ELENBQUM7SUFFRCxnQ0FBZ0M7SUFDaEMsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxHQUFHLE1BQU0sQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFBO0lBRWxFLDJDQUEyQztJQUMzQyx1RUFBdUU7SUFDdkUsTUFBTSxZQUFZLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFRLENBQUE7SUFDN0QsTUFBTSxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sS0FBSyxFQUFFLEVBQUUsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFBO0lBRWhELE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLEtBQUssS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFBO0lBRW5ELGlDQUFpQztJQUNqQyx1REFBdUQ7SUFDdkQsZ0RBQWdEO0lBRWhELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQUUsT0FBTyxFQUFFLHVCQUF1QixFQUFFLENBQUMsQ0FBQTtBQUM1RCxDQUFDIn0=