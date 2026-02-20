import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function completeInventoryFix() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    const locationRes = await client.query(
      `SELECT id FROM stock_location WHERE deleted_at IS NULL LIMIT 1;`
    );
    const locationId = locationRes.rows[0].id;

    // Step 1: Delete inventory items with NULL SKUs
    console.log("Step 1: Cleaning up NULL SKU inventory items...");
    const deleteRes = await client.query(
      `DELETE FROM inventory_item WHERE sku IS NULL;`
    );
    console.log(`  Deleted ${deleteRes.rowCount} inventory items with NULL SKUs\n`);

    // Step 2: Fix variants with NULL SKUs
    console.log("Step 2: Fixing variants with NULL SKUs...");
    const nullSKURes = await client.query(
      `SELECT pv.id, p.title, pv.title as variant_title
       FROM product_variant pv
       JOIN product p ON p.id = pv.product_id
       WHERE pv.sku IS NULL
       ORDER BY p.title;`
    );

    for (const variant of nullSKURes.rows) {
      const sku = `${variant.title.substring(0, 10).toUpperCase().replace(/[^A-Z0-9]/g, "")}-${variant.variant_title.replace(/[^A-Za-z0-9]/g, "").toUpperCase().substring(0, 10)}-${variant.id.substring(variant.id.length - 6)}`;
      
      console.log(`  ${variant.title} (${variant.variant_title}): ${sku}`);
      
      await client.query(`UPDATE product_variant SET sku = $1 WHERE id = $2;`, [sku, variant.id]);
      
      const invRes = await client.query(
        `INSERT INTO inventory_item (id, sku, title, description, requires_shipping)
         VALUES ('iitem_' || substring(md5(random()::text), 1, 20), $1, $2, $3, true)
         RETURNING id;`,
        [sku, variant.title, variant.variant_title]
      );
      const invId = invRes.rows[0].id;
      
      await client.query(
        `INSERT INTO inventory_level (id, inventory_item_id, location_id, reserved_quantity, stocked_quantity)
         VALUES ('invlvl_' || substring(md5(random()::text), 1, 20), $1, $2, 0, 1000);`,
        [invId, locationId]
      );
      
      await client.query(
        `INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity)
         VALUES ('pvii_' || substring(md5(random()::text), 1, 20), $1, $2, 1);`,
        [variant.id, invId]
      );
    }
    
    console.log(`  Fixed ${nullSKURes.rows.length} variants\n`);

    // Step 3: Link remaining variants to their inventory items
    console.log("Step 3: Linking variants to inventory items...");
    const unlinkedRes = await client.query(
      `SELECT pv.id as variant_id, pv.sku, ii.id as inventory_item_id, p.title
       FROM product_variant pv
       JOIN product p ON p.id = pv.product_id
       LEFT JOIN product_variant_inventory_item pvii ON pvii.variant_id = pv.id
       LEFT JOIN inventory_item ii ON ii.sku = pv.sku
       WHERE pvii.id IS NULL AND pv.sku IS NOT NULL AND ii.id IS NOT NULL
       ORDER BY p.title;`
    );

    for (const row of unlinkedRes.rows) {
      console.log(`  Linking: ${row.title} - ${row.sku}`);
      await client.query(
        `INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity)
         VALUES ('pvii_' || substring(md5(random()::text), 1, 20), $1, $2, 1);`,
        [row.variant_id, row.inventory_item_id]
      );
    }
    
    console.log(`  Linked ${unlinkedRes.rows.length} variants\n`);

    // Verify
    const verifyRes = await client.query(
      `SELECT COUNT(*) FROM product_variant pv
       LEFT JOIN product_variant_inventory_item pvii ON pvii.variant_id = pv.id
       WHERE pvii.id IS NULL AND pv.deleted_at IS NULL;`
    );

    console.log(`✅ COMPLETE`);
    console.log(`  Variants still without inventory: ${verifyRes.rows[0].count}`);
  } catch (error) {
    console.error("✗ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

completeInventoryFix();
