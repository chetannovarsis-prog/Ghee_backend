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

// Get all orders
const result = await client.query(`
  SELECT 
    o.id,
    o.display_id,
    o.email,
    o.customer_id,
    o.created_at,
    o.status,
    c.email as customer_email,
    COUNT(oi.id) as item_count
  FROM "order" o
  LEFT JOIN customer c ON o.customer_id = c.id
  LEFT JOIN order_item oi ON o.id = oi.order_id
  GROUP BY o.id, o.display_id, o.email, o.customer_id, o.created_at, o.status, c.email
  ORDER BY o.created_at DESC
  LIMIT 20
`);

console.log('\n=== ALL ORDERS ===\n');
console.log(`Total orders: ${result.rows.length}\n`);

result.rows.forEach((order, i) => {
  console.log(`${i + 1}. Order #${order.display_id}`);
  console.log(`   ID: ${order.id}`);
  console.log(`   Email: ${order.email}`);
  console.log(`   Customer ID: ${order.customer_id || 'GUEST ORDER'}`);
  console.log(`   Customer Email: ${order.customer_email || 'N/A'}`);
  console.log(`   Status: ${order.status}`);
  console.log(`   Items: ${order.item_count}`);
  console.log(`   Created: ${order.created_at}`);
  console.log('');
});

// Get customers
const customers = await client.query(`
  SELECT id, email, has_account, created_at
  FROM customer
  ORDER BY created_at DESC
  LIMIT 10
`);

console.log('\n=== CUSTOMERS ===\n');
customers.rows.forEach((cust, i) => {
  console.log(`${i + 1}. ${cust.email}`);
  console.log(`   ID: ${cust.id}`);
  console.log(`   Has Account: ${cust.has_account}`);
  console.log(`   Created: ${cust.created_at}`);
  console.log('');
});

await client.end();
