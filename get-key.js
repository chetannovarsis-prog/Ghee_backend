const { Client } = require('pg');
const client = new Client({
    connectionString: 'postgres://postgres:123456@localhost/medusa'
});

client.connect()
    .then(() => client.query("SELECT token FROM api_key WHERE type = 'publishable' LIMIT 1;"))
    .then(res => {
        if (res.rows.length > 0) {
            console.log('---PUBLISHABLE_KEY_START---');
            console.log(res.rows[0].token);
            console.log('---PUBLISHABLE_KEY_END---');
        } else {
            console.log('No publishable key found.');
        }
        process.exit(0);
    })
    .catch(e => {
        console.error(e);
        process.exit(1);
    });
