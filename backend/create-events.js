require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

async function addEvents() {
    try {
        await client.connect();
        console.log('✅ Connected\n');

        // Get clubs
        const clubsResult = await client.query('SELECT id, name FROM nightclubs');
        const clubs = clubsResult.rows;

        console.log(`Found ${clubs.length} clubs\n`);

        const events = [
            { name: 'New Year Bash 2025', desc: 'Ring in 2025 with champagne & fireworks', date: '2025-01-01', price: 50 },
            { name: 'Ladies Night', desc: 'Free entry for ladies all night', date: '2024-12-27', price: 0 },
            { name: 'Electronic Festival', desc: 'Top international DJs', date: '2024-12-28', price: 35 },
            { name: 'Latin Night Fiesta', desc: 'Salsa, bachata, reggaeton', date: '2024-12-26', price: 20 },
            { name: 'Hip Hop Takeover', desc: 'Live performances & celebrity DJs', date: '2024-12-30', price: 40 },
        ];

        for (let i = 0; i < events.length; i++) {
            const e = events[i];
            const club = clubs[i % clubs.length];

            await client.query(
                'INSERT INTO events (name, description, date, "nightclubId", price) VALUES ($1, $2, $3, $4, $5)',
                [e.name, e.desc, e.date, club.id, e.price]
            );
            console.log(`✅ ${e.name} → ${club.name}`);
        }

        const count = await client.query('SELECT COUNT(*) FROM events');
        console.log(`\n✅ Done! Total events: ${count.rows[0].count}`);

        await client.end();
    } catch (error) {
        console.error('Error:', error.message);
        await client.end();
    }
}

addEvents();
