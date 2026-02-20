import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function diagnoseShippingOption() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Get shipping option details
    const optRes = await client.query(
      `SELECT 
        id, name, provider_id, price_type, service_zone_id, 
        shipping_profile_id, data
       FROM shipping_option 
       WHERE deleted_at IS NULL;`
    );

    console.log("Shipping Options:");
    optRes.rows.forEach((row) => {
      console.log(`\n  ID: ${row.id}`);
      console.log(`  Name: ${row.name}`);
      console.log(`  Provider ID: ${row.provider_id || "NULL ❌"}`);
      console.log(`  Price Type: ${row.price_type}`);
      console.log(`  Service Zone: ${row.service_zone_id}`);
      console.log(`  Shipping Profile: ${row.shipping_profile_id || "null"}`);
      console.log(`  Data: ${JSON.stringify(row.data)}`);
    });

    // Get fulfillment providers
    const provRes = await client.query(
      `SELECT id, identifier FROM fulfillment_provider;`
    );

    console.log("\n\nAvailable Fulfillment Providers:");
    if (provRes.rows.length === 0) {
      console.log("  ❌ NONE FOUND!");
    } else {
      provRes.rows.forEach((row) => {
        console.log(`  ${row.id}: ${row.identifier}`);
      });
    }
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

diagnoseShippingOption();
