import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function addMissingStockLevels() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    const inventoryItemIds = [
      'iitem_9f45aff03004e6d87d59',  // 5L Buffalo Ghee
      'iitem_3f6154d349ecc439e20c'   // 500ml Buffalo Ghee
    ];

    // Get location
    const locRes = await client.query(
      `SELECT id FROM stock_location WHERE deleted_at IS NULL LIMIT 1;`
    );
    const locationId = locRes.rows[0].id;

    for (const invItemId of inventoryItemIds) {
      // Check if level exists
      const checkRes = await client.query(
        `SELECT id FROM inventory_level WHERE inventory_item_id = $1 AND location_id = $2;`,
        [invItemId, locationId]
      );

      if (checkRes.rows.length === 0) {
        // Create inventory level
        await client.query(
          `INSERT INTO inventory_level (id, inventory_item_id, location_id, reserved_quantity, stocked_quantity)
           VALUES ('invlvl_' || substring(md5(random()::text), 1, 20), $1, $2, 0, 1000);`,
          [invItemId, locationId]
        );
        console.log(`✓ Created stock level for: ${invItemId} (1000 units)`);
      } else {
        console.log(`✓ Stock level already exists for: ${invItemId}`);
      }
    }

    console.log(`\n✅ SUCCESS - All inventory items now have stock!`);
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

addMissingStockLevels();
