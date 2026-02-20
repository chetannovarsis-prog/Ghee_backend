import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function enableInventoryManagement() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Check current inventory management status
    const checkRes = await client.query(
      `SELECT id, manage_inventory FROM product_variant 
       WHERE deleted_at IS NULL
       ORDER BY manage_inventory DESC;`
    );

    const managedCount = checkRes.rows.filter((r) => r.manage_inventory).length;
    const unmanagedCount = checkRes.rows.length - managedCount;

    console.log(`Current inventory management status:`);
    console.log(`  Manage inventory enabled: ${managedCount}`);
    console.log(`  Manage inventory disabled: ${unmanagedCount}\n`);

    // Enable inventory management for all variants
    const updateRes = await client.query(
      `UPDATE product_variant 
       SET manage_inventory = true
       WHERE deleted_at IS NULL;`
    );

    console.log(`✓ Updated ${updateRes.rowCount} variants to manage_inventory = true\n`);

    // Verify
    const verifyRes = await client.query(
      `SELECT COUNT(*) as managed FROM product_variant 
       WHERE manage_inventory = true AND deleted_at IS NULL;`
    );

    console.log(`✅ SUCCESS`);
    console.log(`  All ${verifyRes.rows[0].managed} variants now have inventory management enabled`);
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

enableInventoryManagement();
