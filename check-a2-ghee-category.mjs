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

// Get A2 Ghee category
const categoryResult = await client.query(`
  SELECT id, name, handle 
  FROM product_category 
  WHERE handle = 'a2-ghee' OR name ILIKE '%a2%ghee%'
`);

console.log('\n=== A2 GHEE CATEGORY ===');
console.log(categoryResult.rows);

if (categoryResult.rows.length > 0) {
  const categoryId = categoryResult.rows[0].id;
  
  // Get products in this category
  const productsResult = await client.query(`
    SELECT 
      p.id,
      p.title,
      p.handle,
      p.status,
      COUNT(pv.id) as variant_count
    FROM product p
    JOIN product_category_product pcp ON p.id = pcp.product_id
    LEFT JOIN product_variant pv ON p.id = pv.product_id
    WHERE pcp.product_category_id = $1
    GROUP BY p.id, p.title, p.handle, p.status
    ORDER BY p.title
  `, [categoryId]);
  
  console.log('\n=== PRODUCTS IN A2 GHEE CATEGORY ===');
  console.log(`Total products: ${productsResult.rows.length}\n`);
  
  productsResult.rows.forEach((product, index) => {
    console.log(`${index + 1}. ${product.title}`);
    console.log(`   ID: ${product.id}`);
    console.log(`   Handle: ${product.handle}`);
    console.log(`   Status: ${product.status}`);
    console.log(`   Variants: ${product.variant_count}`);
    console.log('');
  });
}

await client.end();
