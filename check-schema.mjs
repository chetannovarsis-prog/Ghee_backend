import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function checkSchema() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Check product_variant columns
    const variantRes = await client.query(
      `SELECT column_name, data_type FROM information_schema.columns 
       WHERE table_name = 'product_variant' 
       ORDER BY ordinal_position;`
    );

    console.log("product_variant columns:");
    variantRes.rows.forEach((row) => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });

    // Check product columns
    const productRes = await client.query(
      `SELECT column_name, data_type FROM information_schema.columns 
       WHERE table_name = 'product' 
       ORDER BY ordinal_position;`
    );

    console.log("\nproduct columns:");
    productRes.rows.forEach((row) => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });

    // Check shipping_profile columns
    const spRes = await client.query(
      `SELECT column_name, data_type FROM information_schema.columns 
       WHERE table_name = 'shipping_profile' 
       ORDER BY ordinal_position;`
    );

    console.log("\nshipping_profile columns:");
    spRes.rows.forEach((row) => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });

    // Get a sample variant to see what data it has
    const sampleRes = await client.query(
      `SELECT * FROM product_variant 
       WHERE deleted_at IS NULL 
       LIMIT 1;`
    );

    if (sampleRes.rows.length > 0) {
      console.log("\nSample product_variant row:");
      console.log(JSON.stringify(sampleRes.rows[0], null, 2));
    }
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkSchema();
