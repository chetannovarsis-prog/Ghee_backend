import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function linkVariantsToInventory() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Check if the linking table exists
    const tableRes = await client.query(
      `SELECT table_name FROM information_schema.tables 
       WHERE table_schema = 'public'
       AND table_name LIKE '%variant%inventory%';`
    );

    console.log("Variant-Inventory linking tables:");
    if (tableRes.rows.length === 0) {
      console.log("  (none found)\n");
    } else {
      tableRes.rows.forEach((row) => {
        console.log(`  ${row.table_name}`);
      });
      console.log();
    }

    // Check product_variant_inventory_item table
    const linkRes = await client.query(
      `SELECT column_name FROM information_schema.columns 
       WHERE table_name = 'product_variant_inventory_item'
       ORDER BY ordinal_position;`
    );

    if (linkRes.rows.length > 0) {
      console.log("product_variant_inventory_item columns:");
      linkRes.rows.forEach((row) => {
        console.log(`  ${row.column_name}`);
      });
      console.log();
    }

    // Get all variants and their matching inventory items by SKU
    const variantsRes = await client.query(
      `SELECT 
        pv.id as variant_id, 
        pv.sku,
        ii.id as inventory_item_id,
        p.title
       FROM product_variant pv
       JOIN product p ON p.id = pv.product_id
       LEFT JOIN inventory_item ii ON ii.sku = pv.sku
       WHERE pv.deleted_at IS NULL
       ORDER BY p.title;`
    );

    console.log(`Found ${variantsRes.rows.length} variants\n`);

    let linked = 0;
    let alreadyLinked = 0;
    let noInventory = 0;

    for (const row of variantsRes.rows) {
      if (!row.inventory_item_id) {
        console.log(`✗ ${row.title} - NO INVENTORY ITEM FOUND for SKU: ${row.sku}`);
        noInventory++;
        continue;
      }

      // Check if link already exists
      const checkRes = await client.query(
        `SELECT id FROM product_variant_inventory_item 
         WHERE variant_id = $1 AND inventory_item_id = $2;`,
        [row.variant_id, row.inventory_item_id]
      );

      if (checkRes.rows.length > 0) {
        console.log(`✓ ${row.title} - already linked`);
        alreadyLinked++;
        continue;
      }

      // Create the link
      await client.query(
        `INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity)
         VALUES (
           'pvii_' || substring(md5(random()::text), 1, 20),
           $1,
           $2,
           1
         );`,
        [row.variant_id, row.inventory_item_id]
      );

      console.log(`✓ ${row.title} - linked to inventory`);
      linked++;
    }

    console.log(`\n✅ SUMMARY:`);
    console.log(`  Newly linked: ${linked}`);
    console.log(`  Already linked: ${alreadyLinked}`);
    console.log(`  No inventory item: ${noInventory}`);
    console.log(`  Total: ${linked + alreadyLinked + noInventory}`);
  } catch (error) {
    console.error("✗ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

linkVariantsToInventory();
