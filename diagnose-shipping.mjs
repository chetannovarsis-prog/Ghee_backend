import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function diagnose() {
  try {
    await client.connect();
    console.log("✓ Connected to PostgreSQL database");

    // 1. Check shipping option configuration
    const optRes = await client.query(
      `SELECT id, name, service_zone_id FROM shipping_option WHERE deleted_at IS NULL;`
    );

    console.log(`\n[Shipping Option] ${optRes.rows[0]?.id || "NONE"}`);
    const opt = optRes.rows[0];

    if (!opt) {
      console.error("✗ No shipping option found!");
      process.exit(1);
    }

    // 2. Check service zone has location coverage
    const szRes = await client.query(
      `SELECT id, fulfillment_set_id FROM service_zone WHERE id = $1;`,
      [opt.service_zone_id]
    );

    const sz = szRes.rows[0];
    console.log(`  service_zone_id: ${sz.id}`);

    // 3. Check if service zone has location coverage
    const locRes = await client.query(
      `SELECT COUNT(*) as count FROM location_fulfillment_set 
       WHERE fulfillment_set_id = $1;`,
      [sz.fulfillment_set_id]
    );

    console.log(`  location_fulfillment_set count: ${locRes.rows[0].count}`);

    // 4. Check for shipping option rules
    const rulesRes = await client.query(
      `SELECT id FROM shipping_option_rule WHERE shipping_option_id = $1;`,
      [opt.id]
    );

    console.log(`  shipping_option_rule count: ${rulesRes.rows.length}`);

    // 5. Check cart items
    const cartRes = await client.query(
      `SELECT c.id, COUNT(cli.id) as item_count
       FROM cart c
       LEFT JOIN cart_line_item cli ON c.id = cli.cart_id AND cli.deleted_at IS NULL
       WHERE c.deleted_at IS NULL
       GROUP BY c.id
       ORDER BY c.created_at DESC
       LIMIT 1;`
    );

    if (cartRes.rows.length === 0) {
      console.log("\n✗ No cart found");
      process.exit(1);
    }

    const cart = cartRes.rows[0];
    console.log(`\n[Cart] ${cart.id} (items: ${cart.item_count})`);

    if (parseInt(cart.item_count) === 0) {
      console.log("  ✗ Cart is empty!");
      process.exit(1);
    }

    // 6. Check if products have shipping profile
    const prodRes = await client.query(
      `SELECT COUNT(psp.id) as count
       FROM product_shipping_profile psp
       WHERE psp.shipping_profile_id IS NOT NULL;`
    );

    console.log(`  products with shipping profile: ${prodRes.rows[0].count}`);

    // 7. Verify shipping profile exists
    const spRes = await client.query(
      `SELECT COUNT(DISTINCT sp.id) as count FROM shipping_profile sp;`
    );

    console.log(`  total shipping profiles: ${spRes.rows[0].count}`);

    console.log("\n✅ Configuration appears valid. Issue may be in Medusa validation logic.");
    console.log("   Try adding shipping method again and check Medusa server logs.");
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

diagnose();
