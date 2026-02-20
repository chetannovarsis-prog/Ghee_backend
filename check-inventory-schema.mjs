import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function checkInventorySchema() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Check inventory_item columns
    const invRes = await client.query(
      `SELECT column_name, data_type FROM information_schema.columns 
       WHERE table_name = 'inventory_item' 
       ORDER BY ordinal_position;`
    );

    console.log("inventory_item columns:");
    invRes.rows.forEach((row) => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });

    // Check inventory_level columns
    const levelRes = await client.query(
      `SELECT column_name, data_type FROM information_schema.columns 
       WHERE table_name = 'inventory_level' 
       ORDER BY ordinal_position;`
    );

    console.log("\ninventory_level columns:");
    levelRes.rows.forEach((row) => {
      console.log(`  ${row.column_name}: ${row.data_type}`);
    });

    // Get sample inventory item
    const sampleRes = await client.query(
      `SELECT * FROM inventory_item LIMIT 1;`
    );

    if (sampleRes.rows.length > 0) {
      console.log("\nSample inventory_item:");
      console.log(JSON.stringify(sampleRes.rows[0], null, 2));
    }

    // Check variant-inventory relationship
    const relRes = await client.query(
      `SELECT column_name, data_type FROM information_schema.columns 
       WHERE table_name = 'product_variant' 
       AND column_name LIKE '%inventory%';`
    );

    console.log("\nproduct_variant inventory-related columns:");
    if (relRes.rows.length === 0) {
      console.log("  (none)");
    } else {
      relRes.rows.forEach((row) => {
        console.log(`  ${row.column_name}: ${row.data_type}`);
      });
    }
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkInventorySchema();
