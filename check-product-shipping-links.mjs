import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function checkProductShippingLinks() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Get all products
    const allProdsRes = await client.query(
      `SELECT id, title FROM product WHERE deleted_at IS NULL ORDER BY title;`
    );

    console.log(`Total products: ${allProdsRes.rows.length}\n`);

    // Get all product_shipping_profile links
    const linksRes = await client.query(
      `SELECT psp.product_id, psp.shipping_profile_id, sp.name, p.title
       FROM product_shipping_profile psp
       LEFT JOIN shipping_profile sp ON sp.id = psp.shipping_profile_id
       LEFT JOIN product p ON p.id = psp.product_id
       ORDER BY p.title;`
    );

    console.log(
      `Product-Shipping Links: ${linksRes.rows.length}\n`
    );

    if (linksRes.rows.length > 0) {
      linksRes.rows.forEach((row) => {
        console.log(
          `  Product: ${row.title} (${row.product_id})`
        );
        console.log(`    → Shipping Profile: ${row.name} (${row.shipping_profile_id})\n`);
      });
    }

    // Get the cart line item to check what variant it has
    const cartRes = await client.query(
      `SELECT 
        cli.id,
        cli.variant_id,
        pv.id as variant_id_check,
        pv.product_id,
        p.title as product_title,
        psp.shipping_profile_id
       FROM cart_line_item cli
       LEFT JOIN product_variant pv ON pv.id = cli.variant_id
       LEFT JOIN product p ON p.id = pv.product_id
       LEFT JOIN product_shipping_profile psp ON psp.product_id = p.id
       WHERE cli.deleted_at IS NULL
       ORDER BY cli.created_at DESC
       LIMIT 5;`
    );

    console.log("\nRecent cart items:");
    cartRes.rows.forEach((row) => {
      console.log(
        `  Item ID: ${row.id}`
      );
      console.log(`    Variant: ${row.variant_id}`);
      console.log(`    Product: ${row.product_title} (${row.product_id})`);
      console.log(
        `    Shipping Profile: ${row.shipping_profile_id || "NONE"}\n`
      );
    });
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

checkProductShippingLinks();
