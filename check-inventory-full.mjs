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

const result = await client.query(`
  SELECT 
    pv.id as variant_id,
    pv.sku,
    pv.title,
    p.title as product_title,
    ii.id as inventory_item_id,
    pvii.id as link_id,
    il.stocked_quantity,
    sl.name as location_name
  FROM product_variant pv
  LEFT JOIN product p ON pv.product_id = p.id
  LEFT JOIN product_variant_inventory_item pvii ON pv.id = pvii.variant_id
  LEFT JOIN inventory_item ii ON pvii.inventory_item_id = ii.id
  LEFT JOIN inventory_level il ON ii.id = il.inventory_item_id
  LEFT JOIN stock_location sl ON il.location_id = sl.id
  ORDER BY p.title, pv.title
`);

console.log('\n=== INVENTORY STATUS ===\n');
result.rows.forEach(row => {
  const status = row.inventory_item_id && row.link_id && row.stocked_quantity ? '✓' : '✗';
  console.log(`${status} ${row.product_title} - ${row.title || 'default'}`);
  console.log(`   Variant: ${row.variant_id}`);
  console.log(`   SKU: ${row.sku || 'NULL'}`);
  console.log(`   Inventory Item: ${row.inventory_item_id || 'MISSING'}`);
  console.log(`   Link: ${row.link_id || 'MISSING'}`);
  console.log(`   Stock: ${row.stocked_quantity || '0'} @ ${row.location_name || 'N/A'}`);
  console.log('');
});

await client.end();
