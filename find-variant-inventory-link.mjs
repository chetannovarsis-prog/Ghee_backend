import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function findVariantInventoryLink() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Find all tables that might link variants to inventory
    const tablesRes = await client.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public'
       AND (table_name LIKE '%variant%' OR table_name LIKE '%inventory%')
       ORDER BY table_name;`
    );

    console.log("Variant/Inventory related tables:");
    tablesRes.rows.forEach((row) => {
      console.log(`  ${row.table_name}`);
    });

    // Check for junction table
    const junctionRes = await client.query(
      `SELECT table_name, column_name FROM information_schema.columns
       WHERE table_schema = 'public'
       AND (column_name LIKE '%variant%' AND column_name LIKE '%inventory%')
       OR table_name LIKE '%variant%inventory%'
       OR table_name LIKE '%inventory%variant%';`
    );

    console.log("\nTables with both variant and inventory references:");
    if (junctionRes.rows.length === 0) {
      console.log("  (none found)");
    } else {
      junctionRes.rows.forEach((row) => {
        console.log(`  ${row.table_name}.${row.column_name}`);
      });
    }

    // Check product_variant columns for inventory reference
    const varRes = await client.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'product_variant'
       ORDER BY column_name;`
    );

    console.log("\nAll product_variant columns:");
    varRes.rows.forEach((row) => {
      console.log(`  ${row.column_name}`);
    });

    // Get an existing product variant with inventory to see how they're linked
    const existingRes = await client.query(
      `SELECT pv.id, pv.sku
       FROM product_variant pv
       WHERE pv.deleted_at IS NULL
       LIMIT 1;`
    );

    if (existingRes.rows.length > 0) {
      const variantId = existingRes.rows[0].id;
      const sku = existingRes.rows[0].sku;
      console.log(`\nSample variant: ${variantId} (SKU: ${sku})`);

      // Try to find its inventory item by SKU
      const invRes = await client.query(
        `SELECT id, sku FROM inventory_item WHERE sku = $1;`,
        [sku]
      );

      if (invRes.rows.length > 0) {
        console.log(`  Linked inventory item: ${invRes.rows[0].id} (SKU: ${invRes.rows[0].sku})`);
      } else {
        console.log(`  No inventory item found for SKU: ${sku}`);
      }
    }
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

findVariantInventoryLink();
