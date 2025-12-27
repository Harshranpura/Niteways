require('dotenv').config();
const { Client } = require('pg');

const client = new Client({
    host: process.env.DATABASE_HOST,
    port: process.env.DATABASE_PORT,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
});

async function addEventsToDatabase() {
    try {
        await client.connect();
        console.log('✅ Connected to database\n');

        // Get all clubs first
        const clubsResult = await client.query('SELECT id, name FROM nightclubs ORDER BY id');
        const clubs = clubsResult.rows;

        if (clubs.length === 0) {
            console.log('❌ No nightclubs found! Please add clubs first.');
            await client.end();
            return;
        }

        console.log(`📋 Found ${clubs.length} nightclubs\n`);

        // Events to add
        const events = [
            {
                name: 'New Year Bash 2025',
                description: 'Ring in the new year with champagne, fireworks, and top DJs spinning all night long!',
                date: '2025-01-01',
                ticketPrice: 50,
            },
            {
                name: 'Ladies Night',
                description: 'Free entry for ladies all night! Special cocktails, music, and vibes',
                date: '2024-12-27',
                ticketPrice: 0,
            },
            {
                name: 'Electronic Music Festival',
                description: 'featuring top international DJs - 12 hours of non-stop electronic music',
                date: '2024-12-28',
                ticketPrice: 35,
            },
            {
                name: 'Latin Night Fiesta',
                description: 'Salsa, bachata, reggaeton - the hottest Latin beats all night',
                date: '2024-12-26',
                ticketPrice: 20,
            },
            {
                name: 'Hip Hop Takeover',
                description: 'feat. live performances and celebrity DJ guest appearances',
                date: '2024-12-30',
                ticketPrice: 40,
            },
        ];

        console.log('🎉 Adding events...\n');

        // Add events to different clubs
        for (let i = 0; i < events.length; i++) {
            const event = events[i];
            const club = clubs[i % clubs.length]; // Distribute events across clubs

            try {
                // Check if event already exists
                const checkResult = await client.query(
                    'SELECT id FROM events WHERE name = $1 AND "nightclubId" = $2',
                    [event.name, club.id]
                );

                if (checkResult.rows.length > 0) {
                    console.log(`  ⏭️  "${event.name}" at ${club.name} - already exists`);
                    continue;
                }

                // Insert new event
                await client.query(
                    'INSERT INTO events (name, description, date, "nightclubId", "ticketPrice") VALUES ($1, $2, $3, $4, $5)',
                    [event.name, event.description, event.date, club.id, event.ticketPrice]
                );

                console.log(`  ✅ Created "${event.name}" at ${club.name} (€${event.ticketPrice})`);
            } catch (err) {
                console.log(`  ❌ Failed to add "${event.name}": ${err.message}`);
            }
        }

        // Show summary
        console.log('\n📊 Database Summary:');
        const eventsCount = await client.query('SELECT COUNT(*) FROM events');
        const clubsCount = await client.query('SELECT COUNT(*) FROM nightclubs');
        const usersCount = await client.query('SELECT COUNT(*) FROM users');

        console.log(`  Nightclubs: ${clubsCount.rows[0].count}`);
        console.log(`  Events: ${eventsCount.rows[0].count}`);
        console.log(`  Users: ${usersCount.rows[0].count}`);

        console.log('\n✅ Done! Events added successfully!');
        console.log('\n🔄 Next steps:');
        console.log('  1. Refresh admin dashboard → Events tab');
        console.log('  2. Refresh mobile app → Tap on any club → Tickets tab');
        console.log('  3. You should see the new events!');

        await client.end();
    } catch (error) {
        console.error('❌ Error:', error.message);
        await client.end();
        process.exit(1);
    }
}

addEventsToDatabase();
