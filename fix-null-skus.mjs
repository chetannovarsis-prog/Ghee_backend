import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function fixNullSKUs() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Get variants with NULL SKUs
    const nullSKURes = await client.query(
      `SELECT pv.id, p.title, pv.title as variant_title
       FROM product_variant pv
       JOIN product p ON p.id = pv.product_id
       WHERE pv.sku IS NULL AND pv.deleted_at IS NULL
       ORDER BY p.title;`
    );

    console.log(`Found ${nullSKURes.rows.length} variants with NULL SKUs:\n`);

    if (nullSKURes.rows.length === 0) {
      console.log("✅ All variants have SKUs!");
      process.exit(0);
    }

    let fixed = 0;

    for (const variant of nullSKURes.rows) {
      // Generate SKU from product title and variant title
      const productSlug = variant.title
        .toUpperCase()
        .replace(/[^A-Z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 15);
      
      const variantSlug = variant.variant_title
        .replace(/[^A-Za-z0-9]/g, "")
        .toUpperCase();

      // Use variant ID suffix to ensure uniqueness
      const uniqueSuffix = variant.id.substring(variant.id.length - 6);
      const sku = `${productSlug}-${variantSlug}-${uniqueSuffix}`;

      console.log(`${variant.title} (${variant.variant_title})`);
      console.log(`  Generated SKU: ${sku}`);

      // Update the variant with new SKU
      await client.query(
        `UPDATE product_variant SET sku = $1 WHERE id = $2;`,
        [sku, variant.id]
      );

      // Check if inventory item already exists
      const existingInvRes = await client.query(
        `SELECT id FROM inventory_item WHERE sku = $1;`,
        [sku]
      );

      let inventoryItemId;

      if (existingInvRes.rows.length > 0) {
        inventoryItemId = existingInvRes.rows[0].id;
        console.log(`  ✓ Inventory already exists: ${inventoryItemId}`);
      } else {
        // Create inventory item
        const invRes = await client.query(
          `INSERT INTO inventory_item (id, sku, title, description, requires_shipping)
           VALUES (
             'iitem_' || substring(md5(random()::text), 1, 20),
             $1,
             $2,
             $3,
             true
           )
           RETURNING id;`,
          [sku, variant.title, variant.variant_title]
        );
        inventoryItemId = invRes.rows[0].id;
      }

      if (existingInvRes.rows.length > 0) {
        inventoryItemId = existingInvRes.rows[0].id;
        console.log(`  ✓ Inventory already exists: ${inventoryItemId}`);
      } else {
        // Create inventory item
        const invRes = await client.query(
          `INSERT INTO inventory_item (id, sku, title, description, requires_shipping)
           VALUES (
             'iitem_' || substring(md5(random()::text), 1, 20),
             $1,
             $2,
             $3,
             true
           )
           RETURNING id;`,
          [sku, variant.title, variant.variant_title]
        );
        inventoryItemId = invRes.rows[0].id;
      }

      // Get stock location
      const locRes = await client.query(
        `SELECT id FROM stock_location WHERE deleted_at IS NULL LIMIT 1;`
      );
      const locationId = locRes.rows[0].id;

      // Check if inventory level exists
      const existingLevelRes = await client.query(
        `SELECT id FROM inventory_level WHERE inventory_item_id = $1 AND location_id = $2;`,
        [inventoryItemId, locationId]
      );

      if (existingLevelRes.rows.length === 0) {
        // Create inventory level
        await client.query(
          `INSERT INTO inventory_level (id, inventory_item_id, location_id, reserved_quantity, stocked_quantity)
           VALUES (
             'invlvl_' || substring(md5(random()::text), 1, 20),
             $1,
             $2,
             0,
             1000
           );`,
          [inventoryItemId, locationId]
        );
      }

      // Check if link exists
      const existingLinkRes = await client.query(
        `SELECT id FROM product_variant_inventory_item 
         WHERE variant_id = $1 AND inventory_item_id = $2;`,
        [variant.id, inventoryItemId]
      );

      if (existingLinkRes.rows.length === 0) {
        // Link variant to inventory item
        await client.query(
          `INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity)
           VALUES (
             'pvii_' || substring(md5(random()::text), 1, 20),
             $1,
             $2,
             1
           );`,
          [variant.id, inventoryItemId]
        );
      }

      console.log(`  ✓ Created inventory with 1000 stock and linked\n`);
      fixed++;
    }

    console.log(`✅ SUCCESS - Fixed ${fixed} variants`);
  } catch (error) {
    console.error("✗ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixNullSKUs();
