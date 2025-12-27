require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

async function checkEvents() {
    try {
        await client.connect();

        const result = await client.query(`
      SELECT e.name as event, n.name as club, e.date, e.price
      FROM events e 
      JOIN nightclubs n ON e."nightclubId" = n.id 
      ORDER BY e.date
    `);

        console.log('\nEvent → Club Assignments:\n');
        result.rows.forEach(r => {
            console.log(`  ${r.event} → ${r.club} (€${r.price})`);
        });
        console.log(`\nTotal: ${result.rows.length} events`);

        await client.end();
    } catch (error) {
        console.error('Error:', error.message);
        await client.end();
    }
}

checkEvents();
