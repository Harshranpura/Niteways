require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

async function checkAndFixImages() {
    try {
        await client.connect();
        console.log('✅ Connected\n');

        // Get all clubs
        const result = await client.query('SELECT id, name, city, "imageUrl" FROM nightclubs ORDER BY id');

        console.log('📋 Current clubs in database:\n');
        result.rows.forEach(club => {
            const hasImage = club.imageUrl && club.imageUrl.trim() !== '';
            console.log(`  ${club.id}. ${club.name} (${club.city || 'No city'}) - ${hasImage ? '✅ HAS IMAGE' : '❌ NO IMAGE'}`);
        });

        // Fix any missing images
        const nightclubImages = [
            'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800',
            'https://images.unsplash.com/photo-1571407970349-bc81e7e96a47?w=800',
            'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
            'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
            'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800',
        ];

        let fixed = 0;
        for (let i = 0; i < result.rows.length; i++) {
            const club = result.rows[i];
            if (!club.imageUrl || club.imageUrl.trim() === '') {
                const imageUrl = nightclubImages[i % nightclubImages.length];
                await client.query('UPDATE nightclubs SET "imageUrl" = $1 WHERE id = $2', [imageUrl, club.id]);
                console.log(`\n✅ Fixed ${club.name} - added image`);
                fixed++;
            }
        }

        if (fixed === 0) {
            console.log('\n✅ All clubs already have images!');
        } else {
            console.log(`\n✅ Fixed ${fixed} clubs`);
        }

        await client.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await client.end();
        process.exit(1);
    }
}

checkAndFixImages();
