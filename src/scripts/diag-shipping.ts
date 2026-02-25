import { Client } from "pg"

/**
 * Diagnostic: finds the real product-shipping-profile link table
 * and shows current profile assignments.
 */
export default async function diagShipping({ container }) {
    const logger = container.resolve("logger")
    const databaseUrl = process.env.DATABASE_URL
    if (!databaseUrl) { logger.error("No DATABASE_URL"); return }
    const client = new Client({ connectionString: databaseUrl })
    try {
        await client.connect()

        // 1. Show all tables/schemas that contain "shipping" or "profile"
        const tables = await client.query(`
            SELECT table_schema, table_name
            FROM information_schema.tables
            WHERE (table_name ILIKE '%shipping%' OR table_name ILIKE '%profile%')
              AND table_schema NOT IN ('pg_catalog', 'information_schema')
            ORDER BY table_schema, table_name
        `)
        logger.info(`Tables with 'shipping' or 'profile' (${tables.rows.length}):`)
        tables.rows.forEach(r => logger.info(`  ${r.table_schema}.${r.table_name}`))

        // 2. Show columns of the product table
        const prodCols = await client.query(`
            SELECT column_name, data_type
            FROM information_schema.columns
            WHERE table_name = 'product'
            ORDER BY ordinal_position
        `)
        logger.info(`\nproduct table columns:`)
        prodCols.rows.forEach(c => logger.info(`  ${c.column_name}: ${c.data_type}`))

        // 3. Show all schemas
        const schemas = await client.query(`SELECT schema_name FROM information_schema.schemata ORDER BY schema_name`)
        logger.info(`\nAll schemas: ${schemas.rows.map(r => r.schema_name).join(', ')}`)

    } catch (err: any) {
        logger.error(`Error: ${err.message}`)
    } finally {
        await client.end()
    }
}
