import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function debugInventory() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Get variants with NULL SKUs
    const nullRes = await client.query(
      `SELECT pv.id, p.title, pv.title as variant_title
       FROM product_variant pv
       JOIN product p ON p.id = pv.product_id
       WHERE pv.sku IS NULL
       ORDER BY p.title;`
    );

    console.log(`Variants with NULL SKUs: ${nullRes.rows.length}\n`);
    nullRes.rows.forEach((r) => {
      console.log(`  ${r.id}: ${r.title} (${r.variant_title})`);
    });

    // Get all inventory items
    const invRes = await client.query(
      `SELECT sku FROM inventory_item WHERE deleted_at IS NULL ORDER BY sku;`
    );

    console.log(`\nExisting inventory items: ${invRes.rows.length}`);
    invRes.rows.forEach((r) => {
      console.log(`  ${r.sku}`);
    });

    // Get variants WITHOUT inventory links
    const unlinkedRes = await client.query(
      `SELECT pv.id, pv.sku, p.title, pv.title as variant_title
       FROM product_variant pv
       JOIN product p ON p.id = pv.product_id
       LEFT JOIN product_variant_inventory_item pvii ON pvii.variant_id = pv.id
       WHERE pvii.id IS NULL AND pv.deleted_at IS NULL
       ORDER BY p.title;`
    );

    console.log(`\nVariants WITHOUT inventory links: ${unlinkedRes.rows.length}\n`);
    unlinkedRes.rows.forEach((r) => {
      console.log(`  ${r.id}: ${r.title} (${r.variant_title}) - SKU: ${r.sku || "NULL"}`);
    });
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

debugInventory();
