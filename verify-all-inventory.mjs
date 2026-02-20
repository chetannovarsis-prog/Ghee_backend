import pkg from "pg";
import dotenv from "dotenv";

const { Client } = pkg;

dotenv.config();

const client = new Client({
  connectionString:
    process.env.DATABASE_URL ||
    "postgres://postgres:Anshu%40123@localhost/medusa-my-medusa-store",
});

async function verifyAllInventory() {
  try {
    await client.connect();
    console.log("✓ Connected to database\n");

    // Check all variants and their inventory status
    const checkRes = await client.query(
      `SELECT 
        pv.id as variant_id,
        pv.sku,
        p.title,
        pvii.inventory_item_id,
        il.stocked_quantity
       FROM product_variant pv
       JOIN product p ON p.id = pv.product_id
       LEFT JOIN product_variant_inventory_item pvii ON pvii.variant_id = pv.id
       LEFT JOIN inventory_level il ON il.inventory_item_id = pvii.inventory_item_id
       WHERE pv.deleted_at IS NULL
       ORDER BY p.title;`
    );

    console.log("Inventory Status for All Variants:\n");
    
    let hasInventory = 0;
    let noLink = 0;
    let noStock = 0;

    checkRes.rows.forEach((row) => {
      const status = !row.inventory_item_id ? "NO LINK" : 
                     row.stocked_quantity === null ? "NO STOCK" :
                     row.stocked_quantity > 0 ? "✓ READY" : "ZERO STOCK";
      
      console.log(`${status.padEnd(12)} ${row.title} (${row.sku || "NULL SKU"})`);
      console.log(`               Item: ${row.inventory_item_id || "none"}, Stock: ${row.stocked_quantity || "none"}\n`);
      
      if (status === "✓ READY") hasInventory++;
      else if (status === "NO LINK") noLink++;
      else if (status === "NO STOCK" || status === "ZERO STOCK") noStock++;
    });

    console.log(`\n✅ Summary:`);
    console.log(`  Ready: ${hasInventory}`);
    console.log(`  No link: ${noLink}`);
    console.log(`  No/zero stock: ${noStock}`);
    console.log(`  Total: ${checkRes.rows.length}`);
  } catch (error) {
    console.error("✗ Error:", error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

verifyAllInventory();
