/**
 * Diagnostic - find product-shipping-profile link table in Render DB
 * Run: node find-link-table.mjs
 */
import { readFileSync } from "fs"
import pg from "pg"
const { Client } = pg

// Parse DATABASE_URL from .env
const env = readFileSync(".env", "utf8")
const match = env.match(/^DATABASE_URL=(.+)$/m)
const DATABASE_URL = match?.[1]?.trim()

if (!DATABASE_URL) { console.error("No DATABASE_URL"); process.exit(1) }

const client = new Client({
    connectionString: DATABASE_URL,
    ssl: { rejectUnauthorized: false }
})

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"
await client.connect()
console.log("✅ Connected\n")

// 1. Find all tables containing 'profile' or that might link product to shipping
const { rows: tables } = await client.query(`
    SELECT table_schema, table_name, 
           (SELECT COUNT(*) FROM information_schema.columns c WHERE c.table_name = t.table_name AND c.table_schema = t.table_schema) as col_count
    FROM information_schema.tables t
    WHERE (table_name ILIKE '%profile%' OR table_name ILIKE '%product%' OR table_name ILIKE '%shipping%')
      AND table_schema NOT IN ('pg_catalog', 'information_schema')
    ORDER BY table_schema, table_name
`)
console.log(`Tables with product/shipping/profile (${tables.length}):`)
tables.forEach(t => console.log(`  ${t.table_schema}.${t.table_name} (${t.col_count} cols)`))

// 2. Check columns on product table
const { rows: prodCols } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'product' AND table_schema = 'public'
    ORDER BY ordinal_position
`)
console.log(`\nproduct table columns: ${prodCols.map(c => c.column_name).join(', ')}`)

// 3. Check columns of shipping_profile table
const { rows: spCols } = await client.query(`
    SELECT column_name FROM information_schema.columns
    WHERE table_name = 'shipping_profile' AND table_schema = 'public'
    ORDER BY ordinal_position
`)
console.log(`shipping_profile columns: ${spCols.map(c => c.column_name).join(', ')}`)

// 4. Show ALL schemas
const { rows: schemas } = await client.query(`SELECT schema_name FROM information_schema.schemata ORDER BY schema_name`)
console.log(`\nAll schemas: ${schemas.map(s => s.schema_name).join(', ')}`)

// 5. List ALL schemas' tables for 'product_shipping' or similar
const { rows: linkedTables } = await client.query(`
    SELECT table_schema, table_name FROM information_schema.tables
    WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
    ORDER BY table_schema, table_name
`)
console.log(`\nAll user tables across ALL schemas (${linkedTables.length}):`)
linkedTables.forEach(t => console.log(`  ${t.table_schema}.${t.table_name}`))

// 6. Show shipping profiles
const { rows: profiles } = await client.query(`SELECT id, name, type FROM shipping_profile WHERE deleted_at IS NULL`)
console.log(`\nShipping profiles (${profiles.length}):`)
profiles.forEach(p => console.log(`  ${p.id} | ${p.type} | ${p.name}`))

// 7. Show shipping options and their profiles  
const { rows: opts } = await client.query(`SELECT id, name, shipping_profile_id FROM shipping_option WHERE deleted_at IS NULL`)
console.log(`\nShipping options (${opts.length}):`)
opts.forEach(o => console.log(`  ${o.id} | "${o.name}" | profile=${o.shipping_profile_id}`))

await client.end()
console.log("\n=== Done ===")
