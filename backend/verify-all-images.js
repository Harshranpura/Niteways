require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

async function verifyImages() {
    await client.connect();

    const result = await client.query('SELECT id, name, "imageUrl" FROM nightclubs ORDER BY id');

    console.log('\n📋 ALL CLUBS IN DATABASE:\n');
    result.rows.forEach((club, index) => {
        console.log(`${index + 1}. ${club.name}`);
        console.log(`   Image URL: ${club.imageUrl || 'MISSING!'}`);
        console.log('');
    });

    // Count clubs without images
    const noImage = result.rows.filter(c => !c.imageUrl || c.imageUrl.trim() === '');
    console.log(`\n✅ ${result.rows.length - noImage.length} clubs with images`);
    console.log(`❌ ${noImage.length} clubs WITHOUT images`);

    if (noImage.length > 0) {
        console.log('\nClubs needing images:');
        noImage.forEach(c => console.log(`  - ${c.name}`));
    }

    await client.end();
}

verifyImages();
