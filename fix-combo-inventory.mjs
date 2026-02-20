import pg from 'pg';
const { Client } = pg;

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'Anshu@123',
  database: 'medusa-my-medusa-store'
});

await client.connect();

const variantId = 'variant_01KH39AG0JW8AGK63QYAB5CB6X';
const sku = 'COMBO-G';
const stockLocationId = 'sloc_01KGVJ6GMYMVC6X63AY7RAEB50';

console.log('\n=== FIXING GHEE GIANTS COMBO INVENTORY ===\n');

// Step 1: Create inventory item
const inventoryResult = await client.query(`
  INSERT INTO inventory_item (id, sku, created_at, updated_at)
  VALUES (
    'iitem_' || substr(md5(random()::text || clock_timestamp()::text), 1, 20),
    $1,
    NOW(),
    NOW()
  )
  RETURNING id
`, [sku]);

const inventoryItemId = inventoryResult.rows[0].id;
console.log(`✓ Created inventory item: ${inventoryItemId}`);

// Step 2: Link variant to inventory
await client.query(`
  INSERT INTO product_variant_inventory_item (id, variant_id, inventory_item_id, required_quantity, created_at, updated_at)
  VALUES (
    'pvii_' || substr(md5(random()::text || clock_timestamp()::text), 1, 20),
    $1,
    $2,
    1,
    NOW(),
    NOW()
  )
`, [variantId, inventoryItemId]);

console.log(`✓ Linked variant to inventory`);

// Step 3: Add stock level
await client.query(`
  INSERT INTO inventory_level (id, inventory_item_id, location_id, stocked_quantity, reserved_quantity, incoming_quantity, created_at, updated_at)
  VALUES (
    'ilev_' || substr(md5(random()::text || clock_timestamp()::text), 1, 20),
    $1,
    $2,
    1000,
    0,
    0,
    NOW(),
    NOW()
  )
`, [inventoryItemId, stockLocationId]);

console.log(`✓ Added stock level: 1000 units`);

// Verify
const verify = await client.query(`
  SELECT 
    pv.title as variant_title,
    ii.sku,
    il.stocked_quantity,
    sl.name as location
  FROM product_variant pv
  JOIN product_variant_inventory_item pvii ON pv.id = pvii.variant_id
  JOIN inventory_item ii ON pvii.inventory_item_id = ii.id
  JOIN inventory_level il ON ii.id = il.inventory_item_id
  JOIN stock_location sl ON il.location_id = sl.id
  WHERE pv.id = $1
`, [variantId]);

console.log('\n=== VERIFICATION ===');
console.log(verify.rows[0]);
console.log('\n✓ Ghee Giants Combo inventory is ready!\n');

await client.end();
