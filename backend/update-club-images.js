require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

const nightclubImages = [
    { name: 'Paradise Club', imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800' },
    { name: 'Skyline Lounge', imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96a47?w=800' },
    { name: 'Neon Pulse', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800' },
    { name: 'Club Velvet', imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800' },
    { name: 'Sky Garden', imageUrl: 'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800' },
    { name: 'Velvet Rope', imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800' },
    { name: 'The Underground', imageUrl: 'https://images.unsplash.com/photo-1571407999684-8c1e0a08c93b?w=800' },
    { name: 'Lux Nightclub', imageUrl: 'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800' },
    { name: 'Electric Dreams', imageUrl: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800' },
    { name: 'Moonlight Lounge', imageUrl: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800' },
];

async function updateImages() {
    try {
        await client.connect();
        console.log('✅ Connected to database');

        // Update all clubs with images
        for (const club of nightclubImages) {
            const result = await client.query(
                'UPDATE nightclubs SET "imageUrl" = $1 WHERE name = $2 RETURNING id, name',
                [club.imageUrl, club.name]
            );
            if (result.rowCount > 0) {
                console.log(`✅ Updated ${club.name} with image`);
            }
        }

        // Get all clubs to verify
        const allClubs = await client.query('SELECT id, name, city, "imageUrl" FROM nightclubs ORDER BY id');
        console.log('\n📋 All Nightclubs:');
        allClubs.rows.forEach(club => {
            console.log(`  - ${club.name} (${club.city}): ${club.imageUrl ? '✅ Has image' : '❌ No image'}`);
        });

        await client.end();
        console.log('\n✅ Done!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        await client.end();
        process.exit(1);
    }
}

updateImages();
