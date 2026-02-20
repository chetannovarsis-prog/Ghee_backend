import {
    createClient,
} from "@supabase/supabase-js" // This is probably wrong, let's use a simple node script with pg
import pg from 'pg'
const { Client } = pg

async function run() {
    const client = new Client({
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        password: '123456',
        database: 'medusa'
    })
    await client.connect()

    try {
        const res = await client.query(`
      SELECT o.id, o.display_id, ps.provider_id, ps.data
      FROM "order" o
      JOIN "payment_collection" pc ON pc.id = (SELECT payment_collection_id FROM order_payment_collection WHERE order_id = o.id LIMIT 1)
      JOIN "payment_session" ps ON ps.payment_collection_id = pc.id
      ORDER BY o.created_at DESC
      LIMIT 5;
    `)

        console.log(JSON.stringify(res.rows, null, 2))
    } catch (err) {
        // If table names are different (Medusa v2), try searching
        try {
            const res = await client.query(`
        SELECT name FROM font_tables WHERE name LIKE '%payment%' OR name LIKE '%order%';
      `)
            console.log("Tables found:", res.rows)
        } catch (e) {
            console.error(err)
        }
    } finally {
        await client.end()
    }
}

run()
