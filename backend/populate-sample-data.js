require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

const sampleData = {
    nightclubs: [
        {
            name: 'Sky Garden',
            description: 'Rooftop nightclub with stunning city views and world-class DJs',
            city: 'Lisboa',
            imageUrl: 'https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?w=800',
        },
        {
            name: 'Neon Sanctum',
            description: 'Underground club featuring electronic music and neon aesthetics',
            city: 'Porto',
            imageUrl: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96a47?w=800',
        },
        {
            name: 'Velvet Rope',
            description: 'Exclusive VIP nightclub with luxury bottle service',
            city: 'Lisboa',
            imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
        },
        {
            name: 'Paradise Club',
            description: 'Tropical-themed nightclub with exotic cocktails and island vibes',
            city: 'Faro',
            imageUrl: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
        },
    ],
    events: [
        {
            name: 'New Year Bash 2025',
            description: 'Ring in the new year with champagne, fireworks, and live DJ',
            date: '2025-01-01',
            ticketPrice: 50,
        },
        {
            name: 'Ladies Night',
            description: 'Free entry for ladies, special cocktails and music',
            date: '2024-12-25',
            ticketPrice: 0,
        },
        {
            name: 'Electronic Music Festival',
            description: 'feat. Top international DJs spinning all night',
            date: '2024-12-28',
            ticketPrice: 35,
        },
    ],
};

async function populateDatabase() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // Insert nightclubs
        console.log('📍 Inserting nightclubs...');
        const clubIds = [];

        for (const club of sampleData.nightclubs) {
            const result = await client.query(
                `INSERT INTO nightclubs (name, description, city, "imageUrl") 
         VALUES ($1, $2, $3, $4) 
         ON CONFLICT (name) DO UPDATE SET description = $2, city = $3, "imageUrl" = $4
         RETURNING id`,
                [club.name, club.description, club.city, club.imageUrl]
            );
            clubIds.push(result.rows[0].id);
            console.log(`  ✅ ${club.name}`);
        }

        // Insert events (link to first club for demo)
        console.log('\n🎉 Inserting events...');

        for (const event of sampleData.events) {
            await client.query(
                `INSERT INTO events (name, description, date, "nightclubId", "ticketPrice") 
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT DO NOTHING`,
                [event.name, event.description, event.date, clubIds[0], event.ticketPrice]
            );
            console.log(`  ✅ ${event.name}`);
        }

        // Show summary
        console.log('\n📊 Database Summary:');

        const clubs = await client.query('SELECT COUNT(*) FROM nightclubs');
        console.log(`  Nightclubs: ${clubs.rows[0].count}`);

        const events = await client.query('SELECT COUNT(*) FROM events');
        console.log(`  Events: ${events.rows[0].count}`);

        const users = await client.query('SELECT COUNT(*) FROM users');
        console.log(`  Users: ${users.rows[0].count}`);

        console.log('\n✅ Sample data populated successfully!');
        console.log('\n🔍 Quick Test:');
        console.log('  Admin Dashboard: http://localhost:3001');
        console.log('  Mobile App: Refresh Browse screen');
        console.log('  Backend API: GET http://localhost:3000/nightclubs');

        await client.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await client.end();
        process.exit(1);
    }
}

populateDatabase();
