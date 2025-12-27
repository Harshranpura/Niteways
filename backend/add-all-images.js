require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

// Array of nightclub images from Unsplash
const nightclubImages = [
    'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800',
    'https://images.unsplash.com/photo-1571407970349-bc81e7e96a47?w=800',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    'https://images.unsplash.com/photo-1598387993441-a364f854c3e1?w=800',
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800',
    'https://images.unsplash.com/photo-1571407999684-8c1e0a08c93b?w=800',
    'https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800',
    'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?w=800',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    'https://images.unsplash.com/photo-1518641011906-71f08a65e3a3?w=800',
    'https://images.unsplash.com/photo-1519455953755-af066f52f1a6?w=800',
    'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=800',
    'https://images.unsplash.com/photo-1571266028243-d220c6e1a0ec?w=800',
    'https://images.unsplash.com/photo-1582610285985-a42d9193f2fd?w=800',
];

async function addImagesToAllClubs() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // Get ALL clubs from database
        const result = await client.query('SELECT id, name, "imageUrl" FROM nightclubs ORDER BY id');
        console.log(`📊 Found ${result.rows.length} nightclubs\n`);

        let updated = 0;
        let skipped = 0;

        // Update each club
        for (let i = 0; i < result.rows.length; i++) {
            const club = result.rows[i];

            // If club already has an image, skip it
            if (club.imageUrl && club.imageUrl.trim() !== '') {
                console.log(`⏭️  ${club.name} - Already has image, skipping`);
                skipped++;
                continue;
            }

            // Assign image (cycle through the array)
            const imageUrl = nightclubImages[i % nightclubImages.length];

            await client.query(
                'UPDATE nightclubs SET "imageUrl" = $1 WHERE id = $2',
                [imageUrl, club.id]
            );

            console.log(`✅ ${club.name} - Added image`);
            updated++;
        }

        console.log(`\n📈 Summary:`);
        console.log(`  ✅ Updated: ${updated} clubs`);
        console.log(`  ⏭️  Skipped: ${skipped} clubs (already had images)`);
        console.log(`  📊 Total: ${result.rows.length} clubs`);

        // Verify all clubs now have images
        const verify = await client.query('SELECT id, name, "imageUrl" FROM nightclubs ORDER BY id');
        const withoutImages = verify.rows.filter(c => !c.imageUrl || c.imageUrl.trim() === '');

        console.log(`\n🔍 Verification:`);
        if (withoutImages.length === 0) {
            console.log('  ✅ ALL clubs now have images!');
        } else {
            console.log(`  ⚠️  ${withoutImages.length} clubs still missing images:`);
            withoutImages.forEach(c => console.log(`    - ${c.name}`));
        }

        await client.end();
        console.log('\n✅ Done!');
    } catch (error) {
        console.error('❌ Error:', error.message);
        console.error(error);
        await client.end();
        process.exit(1);
    }
}

addImagesToAllClubs();
