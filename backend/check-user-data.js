const { Client } = require('pg');

async function checkUserData() {
    const client = new Client({
        user: 'postgres',
        host: 'localhost',
        database: 'nightclub',
        password: 'Harsh@321',
        port: 5432,
    });

    try {
        await client.connect();
        console.log('Connected to database');

        // Get all users with their fields
        const result = await client.query('SELECT id, "firstName", "lastName", email, mobile, gender, birthday, location FROM "user" ORDER BY "createdAt" DESC');

        console.log('\n=== ALL USERS ===');
        result.rows.forEach((user, index) => {
            console.log(`\n${index + 1}. User ${user.id}:`);
            console.log(`   Name: ${user.firstName} ${user.lastName}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Mobile: ${user.mobile}`);
            console.log(`   Gender: ${user.gender || '(not set)'}`);
            console.log(`   Birthday: ${user.birthday || '(not set)'}`);
            console.log(`   Location: ${user.location || '(not set)'}`);
        });

        await client.end();
    } catch (error) {
        console.error('Database error:', error);
    }
}

checkUserData();
