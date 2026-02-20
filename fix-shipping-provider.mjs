import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function fixShippingOption() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // 1. List all fulfillment providers
    const providersRes = await client.query(
      `SELECT * FROM fulfillment_provider;`
    );

    console.log("Available Fulfillment Providers:");
    providersRes.rows.forEach((row) => {
      console.log(`  ${row.id}`);
      Object.keys(row).forEach((key) => {
        if (key !== 'id') {
          console.log(`    ${key}: ${JSON.stringify(row[key])}`);
        }
      });
    });

    if (providersRes.rows.length === 0) {
      console.log("  ❌ No providers found!");
      // Create a manual provider if none exists
      const createRes = await client.query(
        `INSERT INTO fulfillment_provider (id) 
         VALUES ('manual')
         ON CONFLICT DO NOTHING
         RETURNING id;`
      );
      console.log(`\n  Created manual provider: ${createRes.rows[0]?.id}`);
    }

    // 2. Get current shipping option
    const optRes = await client.query(
      `SELECT * FROM shipping_option 
       WHERE deleted_at IS NULL 
       ORDER BY created_at DESC 
       LIMIT 1;`
    );

    const opt = optRes.rows[0];
    console.log(`\nCurrent Shipping Option: ${opt.id}`);
    console.log(`  provider_id: ${opt.provider_id}`);
    console.log(`  data.provider_id: ${opt.data?.provider_id}`);

    // 3. Update provider_id to have a valid value
    const updateRes = await client.query(
      `UPDATE shipping_option 
       SET provider_id = 'manual'
       WHERE id = $1;`,
      [opt.id]
    );

    console.log(`\n✓ Updated shipping option provider_id to: manual`);

    // 4. Verify the update
    const verifyRes = await client.query(
      `SELECT id, provider_id FROM shipping_option 
       WHERE id = $1;`,
      [opt.id]
    );

    console.log(`\n✅ Verified: provider_id is now: ${verifyRes.rows[0].provider_id}`);
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixShippingOption();
