require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

async function updateAllClubImages() {
    await client.connect();

    // Update ALL clubs with fresh working image URLs
    await client.query(`
    UPDATE nightclubs 
    SET "imageUrl" = 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800' 
    WHERE name = 'Sky Garden'
  `);

    await client.query(`
    UPDATE nightclubs 
    SET "imageUrl" = 'https://images.unsplash.com/photo-1571407970349-bc81e7e96a47?w=800' 
    WHERE name = 'Neon Sanctum'
  `);

    await client.query(`
    UPDATE nightclubs 
    SET "imageUrl" = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' 
    WHERE name = 'Velvet Rope'
  `);

    console.log('✅ Updated all club images!');

    const result = await client.query('SELECT name, "imageUrl" FROM nightclubs');
    console.log('\n📋 All clubs:');
    result.rows.forEach(c => console.log(`  - ${c.name}: ${c.imageUrl}`));

    await client.end();
}

updateAllClubImages().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
