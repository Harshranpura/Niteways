require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

async function checkImages() {
    try {
        await client.connect();
        const result = await client.query('SELECT name, "imageUrl" FROM nightclubs ORDER BY name');
        console.log('\nClub Images:');
        result.rows.forEach(r => {
            console.log(`  ${r.name}: ${r.imageUrl ? 'HAS IMAGE' : 'NO IMAGE'}`);
        });
        await client.end();
    } catch (error) {
        console.error('Error:', error.message);
        await client.end();
    }
}

checkImages();
