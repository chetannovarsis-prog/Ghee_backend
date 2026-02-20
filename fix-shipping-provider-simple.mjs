import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function fixShippingProvider() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Update with correct provider ID
    const updateRes = await client.query(
      `UPDATE shipping_option 
       SET provider_id = 'manual_manual'
       WHERE id = 'so_eabcjdnm46h';`
    );

    console.log(`✓ Updated provider_id for shipping option so_eabcjdnm46h`);

    // Verify
    const verifyRes = await client.query(
      `SELECT id, name, provider_id FROM shipping_option 
       WHERE id = 'so_eabcjdnm46h';`
    );

    if (verifyRes.rows.length > 0) {
      const result = verifyRes.rows[0];
      console.log(`\n✅ SUCCESS - Shipping Option:`);
      console.log(`  ID: ${result.id}`);
      console.log(`  Name: ${result.name}`);
      console.log(`  Provider ID: ${result.provider_id}`);
    }
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixShippingProvider();
