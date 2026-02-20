import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function setupInventory() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // 1. Get all product variants
    const variantsRes = await client.query(
      `SELECT pv.id, p.title, pv.title as variant_title
       FROM product_variant pv
       JOIN product p ON p.id = pv.product_id
       WHERE pv.deleted_at IS NULL
       ORDER BY p.title;`
    );

    console.log(`Found ${variantsRes.rows.length} variants\n`);

    // 2. Get inventory service location (warehouse)
    const locRes = await client.query(
      `SELECT id FROM stock_location WHERE deleted_at IS NULL LIMIT 1;`
    );

    let locationId = locRes.rows[0]?.id;

    if (!locationId) {
      console.log("⚠ No stock location found. Creating default warehouse...");
      const createLocRes = await client.query(
        `INSERT INTO stock_location (id, name, address_1, country_code)
         VALUES ('sloc_default', 'Default Warehouse', '123 Main St', 'IN')
         RETURNING id;`
      );
      locationId = createLocRes.rows[0].id;
      console.log(`  Created location: ${locationId}\n`);
    }

    console.log(`Using stock location: ${locationId}\n`);

    // 3. Create inventory items for each variant
    let created = 0;
    let updated = 0;

    for (const variant of variantsRes.rows) {
      // Check if inventory item already exists
      const checkRes = await client.query(
        `SELECT id FROM inventory_item WHERE variant_id = $1;`,
        [variant.id]
      );

      if (checkRes.rows.length > 0) {
        console.log(`✓ ${variant.title} (${variant.variant_title}) - already has inventory`);
        updated++;
        continue;
      }

      // Create inventory item
      const invRes = await client.query(
        `INSERT INTO inventory_item (id, variant_id, sku, requires_backorder, managed)
         VALUES (
           'invitem_' || substring(md5(random()::text), 1, 20),
           $1,
           $2 || '_inv',
           false,
           true
         )
         RETURNING id;`,
        [variant.id, variant.title]
      );

      if (invRes.rows.length > 0) {
        const inventoryItemId = invRes.rows[0].id;

        // Add stock for the location
        const stockRes = await client.query(
          `INSERT INTO inventory_level (id, inventory_item_id, stock_location_id, reserved_quantity, stocked_quantity)
           VALUES (
             'invlvl_' || substring(md5(random()::text), 1, 20),
             $1,
             $2,
             0,
             1000
           );`,
          [inventoryItemId, locationId]
        );

        console.log(`✓ ${variant.title} (${variant.variant_title}) - inventory created with 1000 stock`);
        created++;
      }
    }

    console.log(`\n✅ SUCCESS`);
    console.log(`  Created: ${created} inventory items`);
    console.log(`  Already existed: ${updated} items`);
    console.log(`  Total variants processed: ${created + updated}`);
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setupInventory();
