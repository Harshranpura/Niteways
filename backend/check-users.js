require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

async function checkUsers() {
    try {
        await client.connect();
        const result = await client.query('SELECT id, email, "firstName", "lastName", "createdAt" FROM users');
        console.log(`\nFound ${result.rows.length} users in database:\n`);
        result.rows.forEach(u => {
            console.log(`  ${u.firstName} ${u.lastName} (${u.email})`);
            console.log(`    Created: ${new Date(u.createdAt).toLocaleDateString()}`);
        });
        await client.end();
    } catch (error) {
        console.error('Error:', error.message);
        await client.end();
    }
}

checkUsers();
