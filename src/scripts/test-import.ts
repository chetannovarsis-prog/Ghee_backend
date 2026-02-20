
try {
    console.log("Importing service...")
    const Service = require("../modules/razorpay/service").default
    console.log("Service imported:", Service)

    console.log("Importing module index...")
    const Module = require("../modules/razorpay/index")
    console.log("Module imported:", Module)
    
    if (Module.default) {
        console.log("Module.default is array?", Array.isArray(Module.default))
    }
} catch (e) {
    console.error("Import failed:", e)
}
