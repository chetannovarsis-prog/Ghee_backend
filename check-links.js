const { Client } = require('pg');
const client = new Client({
    connectionString: 'postgres://postgres:123456@localhost/medusa'
});

client.connect()
    .then(() => client.query(`
    SELECT ak.id as key_id, ak.token, sc.id as sc_id, sc.name as sc_name 
    FROM api_key ak
    LEFT JOIN api_key_sales_channel aksc ON ak.id = aksc.api_key_id
    LEFT JOIN sales_channel sc ON aksc.sales_channel_id = sc.id
    WHERE ak.type = 'publishable';
  `))
    .then(res => {
        console.log('---DATA_START---');
        console.log(JSON.stringify(res.rows, null, 2));
        console.log('---DATA_END---');
        process.exit(0);
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
