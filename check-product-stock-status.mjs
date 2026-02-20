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

// Check which products have inventory issues
const result = await client.query(`
  SELECT 
    p.id,
    p.title,
    p.status,
    pcp.product_category_id,
    COUNT(DISTINCT pv.id) as total_variants,
    COUNT(DISTINCT CASE 
      WHEN ii.id IS NOT NULL AND il.stocked_quantity > 0 
      THEN pv.id 
    END) as variants_with_stock
  FROM product p
  LEFT JOIN product_category_product pcp ON p.id = pcp.product_id
  LEFT JOIN product_variant pv ON p.id = pv.product_id
  LEFT JOIN product_variant_inventory_item pvii ON pv.id = pvii.variant_id
  LEFT JOIN inventory_item ii ON pvii.inventory_item_id = ii.id
  LEFT JOIN inventory_level il ON ii.id = il.inventory_item_id
  WHERE pcp.product_category_id = 'pcat_01KH35R76NN4PGW7BNG79G8PZ0'
  GROUP BY p.id, p.title, p.status, pcp.product_category_id
  ORDER BY p.title
`);

console.log('\n=== A2 GHEE PRODUCTS INVENTORY STATUS ===\n');
result.rows.forEach((row, i) => {
  const hasStock = row.variants_with_stock > 0;
  const status = hasStock ? '✓' : '✗';
  console.log(`${status} ${i+1}. ${row.title}`);
  console.log(`   Status: ${row.status}`);
  console.log(`   Total Variants: ${row.total_variants}`);
  console.log(`   Variants with Stock: ${row.variants_with_stock}`);
  console.log('');
});

await client.end();
