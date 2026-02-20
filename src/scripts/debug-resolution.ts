
import { resolve } from "path"

export default async function debugResolution() {
  try {
    console.log("Debug Resolution Script Started")
    const cwd = process.cwd()
    console.log("CWD:", cwd)

    const modulePath = "./src/modules/razorpay/index"
    console.log("Target path:", modulePath)

    try {
        const resolvedPath = require.resolve(modulePath, { paths: [cwd] })
        console.log("Resolved path:", resolvedPath)
        
        console.log("Attempting dynamic import...")
        const module = await import(resolvedPath)
        console.log("Module loaded successfully.")
        console.log("Keys:", Object.keys(module))
        console.log("Default export:", module.default)
        if (Array.isArray(module.default)) {
            console.log("Default export is an array with length:", module.default.length)
            console.log("Item 0:", module.default[0])
        }
    } catch (err) {
        console.error("Resolution/Import failed:", err)
    }

  } catch (e) {
    console.error("Script error:", e)
  }
}
