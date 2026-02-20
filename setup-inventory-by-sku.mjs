import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function setupInventoryByVariant() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Get all product variants
    const variantsRes = await client.query(
      `SELECT pv.id, pv.sku, p.title, pv.title as variant_title
       FROM product_variant pv
       JOIN product p ON p.id = pv.product_id
       WHERE pv.deleted_at IS NULL
       ORDER BY p.title;`
    );

    console.log(`Found ${variantsRes.rows.length} variants\n`);

    // Get stock location
    const locRes = await client.query(
      `SELECT id FROM stock_location WHERE deleted_at IS NULL LIMIT 1;`
    );

    const locationId = locRes.rows[0]?.id;
    if (!locationId) {
      console.error("✗ No stock location found!");
      process.exit(1);
    }

    console.log(`Using stock location: ${locationId}\n`);

    // Create inventory items for each variant
    let created = 0;
    let updated = 0;

    for (const variant of variantsRes.rows) {
      // Check if inventory item already exists by SKU
      const checkRes = await client.query(
        `SELECT id FROM inventory_item WHERE sku = $1;`,
        [variant.sku]
      );

      if (checkRes.rows.length > 0) {
        console.log(
          `✓ ${variant.title} (${variant.variant_title}) - inventory exists`
        );
        updated++;
        continue;
      }

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
        [variant.sku, variant.title, variant.variant_title]
      );

      if (invRes.rows.length > 0) {
        const inventoryItemId = invRes.rows[0].id;

        // Add stock level for the location
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

        console.log(
          `✓ ${variant.title} (${variant.variant_title}) - inventory created with 1000 stock`
        );
        created++;
      }
    }

    console.log(`\n✅ SUCCESS`);
    console.log(`  Created: ${created} inventory items`);
    console.log(`  Already existed: ${updated} items`);
    console.log(`  Total variants processed: ${created + updated}`);
  } catch (error) {
    console.error("✗ Error:", error.message);
    console.error(error.stack);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupInventoryByVariant();
