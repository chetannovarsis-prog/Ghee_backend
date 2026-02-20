import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function fixLastVariant() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    const sku = "A2-GHEE-500ML";
    const variantId = "variant_01KH3M4GAK5S1V9WEYPJ21CMKA";

    // Create inventory item
    const invRes = await client.query(
      `INSERT INTO inventory_item (id, sku, title, description, requires_shipping)
       VALUES ('iitem_' || substring(md5(random()::text), 1, 20), $1, 'A2 ghee', '500ml', true)
       RETURNING id;`,
      [sku]
    );
    const invId = invRes.rows[0].id;
    console.log(`✓ Created inventory item: ${invId}`);

    // Get location
    const locRes = await client.query(
      `SELECT id FROM stock_location WHERE deleted_at IS NULL LIMIT 1;`
    );
    const locationId = locRes.rows[0].id;

    // Create inventory level
    await client.query(
      `INSERT INTO inventory_level (id, inventory_item_id, location_id, reserved_quantity, stocked_quantity)
       VALUES ('invlvl_' || substring(md5(random()::text), 1, 20), $1, $2, 0, 1000);`,
      [invId, locationId]
    );
    console.log(`✓ Created inventory level with 1000 stock`);

    // Link variant
    await client.query(
      `INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity)
       VALUES ('pvii_' || substring(md5(random()::text), 1, 20), $1, $2, 1);`,
      [variantId, invId]
    );
    console.log(`✓ Linked variant to inventory\n`);

    console.log(`✅ SUCCESS - A2 ghee variant is now ready!`);
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixLastVariant();
