import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function fixVariantShippingProfiles() {
  try {
    await client.connect();
    console.log("✓ Connected to database");

    // 1. Get the default shipping profile
    const spRes = await client.query(
      `SELECT id FROM shipping_profile ORDER BY created_at DESC LIMIT 1;`
    );

    if (spRes.rows.length === 0) {
      console.error("✗ No shipping profile found!");
      process.exit(1);
    }

    const shippingProfileId = spRes.rows[0].id;
    console.log(`\nUsing shipping profile: ${shippingProfileId}`);

    // 2. Get all variants without shipping_profile_id
    const variantsRes = await client.query(
      `SELECT pv.id, pv.product_id, p.title 
       FROM product_variant pv
       JOIN product p ON p.id = pv.product_id
       WHERE pv.deleted_at IS NULL 
       AND pv.shipping_profile_id IS NULL
       ORDER BY p.title;`
    );

    console.log(`\nFound ${variantsRes.rows.length} variants needing shipping profiles`);

    if (variantsRes.rows.length === 0) {
      console.log("✅ All variants already have shipping profiles!");
      process.exit(0);
    }

    // 3. Update all variants to use the default shipping profile
    const updateRes = await client.query(
      `UPDATE product_variant 
       SET shipping_profile_id = $1
       WHERE deleted_at IS NULL 
       AND shipping_profile_id IS NULL;`,
      [shippingProfileId]
    );

    console.log(`\n✓ Updated ${updateRes.rowCount} variants`);

    // 4. Verify the update
    const verifyRes = await client.query(
      `SELECT COUNT(*) as count FROM product_variant 
       WHERE shipping_profile_id IS NULL AND deleted_at IS NULL;`
    );

    if (parseInt(verifyRes.rows[0].count) === 0) {
      console.log("\n✅ SUCCESS - All variants now have shipping profiles!");
    } else {
      console.error(
        `\n✗ WARNING - Still ${verifyRes.rows[0].count} variants without profiles`
      );
    }
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

fixVariantShippingProfiles();
