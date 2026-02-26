/**
 * Fix Shipping Profile Mismatch on RENDER production backend
 * Calls the Render admin API to align product shipping profiles
 */
const MEDUSA_URL = "https://ghee-backend-ewtj.onrender.com"
const ADMIN_EMAIL = "chandan.novarsis@gmail.com"
const ADMIN_PASSWORD = "cpcuEkdNV4P8wq4"

console.log(`Connecting to: ${MEDUSA_URL}\n`)

// Step 1: Auth
const authRes = await fetch(`${MEDUSA_URL}/auth/user/emailpass`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
})
const authData = await authRes.json()
if (!authRes.ok) { console.error("Auth failed:", JSON.stringify(authData)); process.exit(1) }

const token = authData.token
if (!token) { console.error("No token in auth response:", JSON.stringify(authData)); process.exit(1) }
console.log("✅ Authenticated\n")

const H = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
}

async function get(path) {
    const r = await fetch(`${MEDUSA_URL}${path}`, { headers: H })
    const t = await r.text()
    if (!r.ok) throw new Error(`GET ${path} → ${r.status}: ${t.substring(0, 300)}`)
    return JSON.parse(t)
}

async function post(path, body) {
    const r = await fetch(`${MEDUSA_URL}${path}`, { method: "POST", headers: H, body: JSON.stringify(body) })
    const t = await r.text()
    if (!r.ok) throw new Error(`POST ${path} → ${r.status}: ${t.substring(0, 300)}`)
    return JSON.parse(t)
}

// Step 2: Get products with their shipping profile info
console.log("Fetching products...")
const { products, count } = await get("/admin/products?limit=200&fields=id,title,shipping_profile_id&expand=shipping_profile")
console.log(`Total: ${count} products`)

// Collect unique profile IDs used by products
const profileIds = [...new Set(products.map(p => p.shipping_profile_id || p.shipping_profile?.id).filter(Boolean))]
console.log(`Product shipping profile IDs: ${JSON.stringify(profileIds)}\n`)

// Step 3: Get shipping options
console.log("Fetching shipping options...")
let shippingOptions = []
try {
    const data = await get("/admin/shipping-options?limit=50")
    shippingOptions = data.shipping_options || []
    console.log(`Found ${shippingOptions.length} shipping option(s):`)
    shippingOptions.forEach(o => console.log(`  - "${o.name}" profile=${o.shipping_profile_id}`))
} catch (e) {
    console.log(`Could not fetch shipping options: ${e.message.substring(0, 100)}`)
}

// Step 4: Find the target profile - what the shipping options use
const optionProfileId = shippingOptions[0]?.shipping_profile_id

if (!optionProfileId) {
    console.log("\n⚠️  No shipping options found. Please run setup-india-shipping first.")
    console.log("Trying to find products mismatch anyway...")
}

const targetProfileId = optionProfileId || profileIds[0]
console.log(`\nTarget profile ID (from shipping option): ${targetProfileId}`)

// Step 5: Fix products that don't have this profile
let fixedCount = 0
for (const prod of products) {
    const currentProfile = prod.shipping_profile_id || prod.shipping_profile?.id
    if (currentProfile !== targetProfileId) {
        console.log(`  Fixing: "${prod.title}" (${currentProfile} → ${targetProfileId})`)
        try {
            await post(`/admin/products/${prod.id}`, { shipping_profile_id: targetProfileId })
            fixedCount++
        } catch (e) {
            console.log(`  ❌ Failed: ${e.message.substring(0, 80)}`)
        }
    } else {
        console.log(`  ✅ OK: "${prod.title}"`)
    }
}

console.log(`\n✅ Fixed ${fixedCount}/${count} product(s)`)
console.log("=== Done! Clear your cart and try checkout again. ===")
