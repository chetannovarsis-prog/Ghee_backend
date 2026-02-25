import { Client } from "pg"

/**
 * This script fixes the missing unique constraint on the region_payment_provider 
 * table in Medusa v2 and directly links pp_manual_manual to the India region.
 * 
 * The root cause: Medusa's link module does an upsert ON CONFLICT (region_id, payment_provider_id)
 * but the table lacks this unique constraint, causing a 500 error when trying to
 * enable a payment provider via the admin UI.
 */
export default async function fixPaymentProviderConstraint({ container }) {
    const logger = container.resolve("logger")

    const databaseUrl = process.env.DATABASE_URL

    if (!databaseUrl) {
        logger.error("DATABASE_URL is not set. Cannot connect to database.")
        return
    }

    const client = new Client({ connectionString: databaseUrl })

    try {
        await client.connect()
        logger.info("Connected to database.")

        // Step 1: Check if the unique constraint already exists
        const constraintCheck = await client.query(`
            SELECT constraint_name 
            FROM information_schema.table_constraints 
            WHERE table_name = 'region_payment_provider' 
              AND constraint_type = 'UNIQUE'
              AND constraint_name = 'uq_region_payment_provider'
        `)

        if (constraintCheck.rows.length === 0) {
            logger.info("Adding missing unique constraint to region_payment_provider table...")

            // First remove any duplicate rows if they exist
            await client.query(`
                DELETE FROM region_payment_provider
                WHERE id NOT IN (
                    SELECT MIN(id)
                    FROM region_payment_provider
                    GROUP BY region_id, payment_provider_id
                )
            `)

            // Add the missing unique constraint
            await client.query(`
                ALTER TABLE region_payment_provider 
                ADD CONSTRAINT uq_region_payment_provider 
                UNIQUE (region_id, payment_provider_id)
            `)
            logger.info("Unique constraint added successfully.")
        } else {
            logger.info("Unique constraint already exists, skipping.")
        }

        // Step 2: Get the India region ID
        const regionResult = await client.query(`
            SELECT id, name FROM region WHERE name = 'India' AND deleted_at IS NULL LIMIT 1
        `)

        if (regionResult.rows.length === 0) {
            logger.error("India region not found in database. Skipping payment provider link.")
            return
        }

        const regionId = regionResult.rows[0].id
        logger.info(`Found India region: ${regionId}`)

        // Step 3: Check if the manual payment provider record exists in payment_provider table
        const providerCheck = await client.query(`
            SELECT id FROM payment_provider WHERE id = 'pp_manual_manual' LIMIT 1
        `)

        if (providerCheck.rows.length === 0) {
            logger.error("pp_manual_manual not found in payment_provider table. Make sure the server started and registered it.")
            return
        }

        // Step 4: Link manual provider to India region (upsert safely now that constraint exists)
        const linkCheck = await client.query(`
            SELECT id FROM region_payment_provider 
            WHERE region_id = $1 AND payment_provider_id = 'pp_manual_manual' AND deleted_at IS NULL
        `, [regionId])

        if (linkCheck.rows.length > 0) {
            logger.info("pp_manual_manual is already linked to India region.")
        } else {
            const newId = `regpp_manual_${Date.now()}`
            await client.query(`
                INSERT INTO region_payment_provider (id, region_id, payment_provider_id, deleted_at, created_at, updated_at)
                VALUES ($1, $2, 'pp_manual_manual', NULL, NOW(), NOW())
                ON CONFLICT (region_id, payment_provider_id) DO NOTHING
            `, [newId, regionId])
            logger.info("Successfully linked pp_manual_manual to India region!")
        }

    } catch (err: any) {
        logger.error(`Error fixing payment provider constraint: ${err.message}`)
        if (err.stack) logger.error(err.stack)
    } finally {
        await client.end()
        logger.info("Database connection closed.")
    }
}
