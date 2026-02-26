/**
 * Fix Shipping Profile Mismatch via direct PostgreSQL connection
 * Run: node fix-shipping-direct.mjs
 * 
 * Reads DATABASE_URL from .env and directly fixes the shipping profiles
 * without needing the Medusa server running.
 */
import { readFileSync } from "fs"
import pg from "pg"
const { Client } = pg

// Read DATABASE_URL from .env file
function getDatabaseUrl() {
    try {
        const env = readFileSync(".env", "utf8")
        const match = env.match(/^DATABASE_URL=(.+)$/m)
        if (match) return match[1].trim()
    } catch { }
    return process.env.DATABASE_URL
}

const DATABASE_URL = getDatabaseUrl()

if (!DATABASE_URL) {
    console.error("Could not find DATABASE_URL in .env file")
    process.exit(1)
}

console.log("Connecting to database...")
const client = new Client({ connectionString: DATABASE_URL, ssl: { rejectUnauthorized: false } })

await client.connect()
console.log("✅ Connected to database\n")

// 1. Show shipping profiles
const profiles = await client.query(`
    SELECT id, name, type FROM shipping_profile WHERE deleted_at IS NULL ORDER BY type
`)
console.log(`Found ${profiles.rows.length} shipping profile(s):`)
profiles.rows.forEach(p => console.log(`  - ${p.type.padEnd(10)} | ${p.name.padEnd(30)} | ${p.id}`))

if (profiles.rows.length === 0) {
    console.error("\nNo shipping profiles found! Run setup-india-shipping.ts first.")
    await client.end()
    process.exit(1)
}

// Find default profile
const defaultProfile = profiles.rows.find(p => p.type === "default") || profiles.rows[0]
console.log(`\nUsing profile: "${defaultProfile.name}" (${defaultProfile.id})\n`)

// 2. Show and fix shipping options
const shippingOpts = await client.query(`
    SELECT id, name, shipping_profile_id FROM shipping_option WHERE deleted_at IS NULL
`)
console.log(`Found ${shippingOpts.rows.length} shipping option(s):`)
for (const opt of shippingOpts.rows) {
    const ok = opt.shipping_profile_id === defaultProfile.id
    console.log(`  ${ok ? "✅" : "❌"} "${opt.name}" -> profile=${opt.shipping_profile_id}`)
}

// Fix mismatched shipping options
const mismatchedOpts = shippingOpts.rows.filter(o => o.shipping_profile_id !== defaultProfile.id)
if (mismatchedOpts.length > 0) {
    await client.query(
        `UPDATE shipping_option SET shipping_profile_id = $1, updated_at = NOW() WHERE deleted_at IS NULL`,
        [defaultProfile.id]
    )
    console.log(`\n✅ Fixed ${mismatchedOpts.length} shipping option(s) to use default profile`)
}

// 3. Show and fix products
const products = await client.query(`
    SELECT id, title, shipping_profile_id FROM product WHERE deleted_at IS NULL ORDER BY title
`)
console.log(`\nFound ${products.rows.length} product(s):`)

let mismatchCount = 0
for (const p of products.rows) {
    const ok = p.shipping_profile_id === defaultProfile.id
    if (!ok) mismatchCount++
    console.log(`  ${ok ? "✅" : "❌"} ${p.title.substring(0, 40)} -> profile=${p.shipping_profile_id}`)
}

if (mismatchCount > 0 || products.rows.some(p => !p.shipping_profile_id)) {
    await client.query(
        `UPDATE product SET shipping_profile_id = $1, updated_at = NOW() WHERE deleted_at IS NULL`,
        [defaultProfile.id]
    )
    console.log(`\n✅ Updated all ${products.rows.length} product(s) to use "${defaultProfile.name}"`)
} else {
    console.log("\n✅ All products already have the correct shipping profile")
}

await client.end()
console.log("\n=== Fix Complete! Clear your cart and try checkout again. ===")
