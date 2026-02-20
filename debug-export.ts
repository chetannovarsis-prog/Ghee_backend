
import mod from "./src/modules/razorpay/index"
import { isArray } from "lodash"

console.log("Module type:", typeof mod)
console.log("Module value:", mod)
console.log("Is array:", Array.isArray(mod))
console.log("Services property:", mod?.services)
console.log("Is services array:", Array.isArray(mod?.services))

if (Array.isArray(mod)) {
    console.log("Iteration over mod:")
    for (const s of mod) {
        console.log(" -", s.name || s.identifier || s)
    }
} else if (mod?.services && Array.isArray(mod.services)) {
    console.log("Iteration over mod.services:")
    for (const s of mod.services) {
        console.log(" -", s.name || s.identifier || s)
    }
} else {
    console.log("NOT ITERABLE in expected ways")
}
