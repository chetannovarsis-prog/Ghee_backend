import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function linkShippingOptionToProfile() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Get shipping option
    const optRes = await client.query(
      `SELECT id, name, shipping_profile_id FROM shipping_option 
       WHERE id = 'so_eabcjdnm46h';`
    );

    if (optRes.rows.length === 0) {
      console.error("✗ Shipping option not found!");
      process.exit(1);
    }

    const opt = optRes.rows[0];
    console.log(`Current Shipping Option:`);
    console.log(`  ID: ${opt.id}`);
    console.log(`  Name: ${opt.name}`);
    console.log(`  Shipping Profile: ${opt.shipping_profile_id || "NULL"}\n`);

    // Get the default shipping profile
    const profilesRes = await client.query(
      `SELECT id, name FROM shipping_profile 
       WHERE deleted_at IS NULL 
       ORDER BY created_at DESC 
       LIMIT 1;`
    );

    if (profilesRes.rows.length === 0) {
      console.error("✗ No shipping profile found!");
      process.exit(1);
    }

    const profile = profilesRes.rows[0];
    console.log(`Shipping Profile to Link:`);
    console.log(`  ID: ${profile.id}`);
    console.log(`  Name: ${profile.name}\n`);

    // Update shipping option to link it to the profile
    const updateRes = await client.query(
      `UPDATE shipping_option 
       SET shipping_profile_id = $1
       WHERE id = $2;`,
      [profile.id, opt.id]
    );

    console.log(`✓ Linked shipping option to profile`);

    // Verify
    const verifyRes = await client.query(
      `SELECT id, name, shipping_profile_id FROM shipping_option 
       WHERE id = 'so_eabcjdnm46h';`
    );

    if (verifyRes.rows.length > 0) {
      const result = verifyRes.rows[0];
      console.log(`\n✅ SUCCESS - Updated Shipping Option:`);
      console.log(`  ID: ${result.id}`);
      console.log(`  Name: ${result.name}`);
      console.log(`  Shipping Profile: ${result.shipping_profile_id}`);
    }
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

linkShippingOptionToProfile();
