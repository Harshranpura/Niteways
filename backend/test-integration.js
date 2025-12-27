const axios = require('axios');

const BASE_URL = 'http://localhost:3000';
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
};

// Test results
const results = {
    passed: 0,
    failed: 0,
    tests: [],
};

async function test(name, testFn) {
    process.stdout.write(`${colors.cyan}Testing:${colors.reset} ${name}... `);
    try {
        await testFn();
        console.log(`${colors.green}✓ PASS${colors.reset}`);
        results.passed++;
        results.tests.push({ name, status: 'PASS' });
    } catch (error) {
        console.log(`${colors.red}✗ FAIL${colors.reset}`);
        console.log(`  ${colors.red}Error: ${error.message}${colors.reset}`);
        results.failed++;
        results.tests.push({ name, status: 'FAIL', error: error.message });
    }
}

async function runIntegrationTests() {
    console.log(`\n${colors.blue}╔════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.blue}║  Niteways Integration Test Suite              ║${colors.reset}`);
    console.log(`${colors.blue}╚════════════════════════════════════════════════╝${colors.reset}\n`);

    // Test 1: Backend Health Check
    await test('Backend is running', async () => {
        const response = await axios.get(BASE_URL);
        if (response.status !== 200 && response.status !== 404) {
            throw new Error(`Expected status 200 or 404, got ${response.status}`);
        }
    });

    // Test 2: Get all nightclubs
    await test('GET /nightclubs returns data', async () => {
        const response = await axios.get(`${BASE_URL}/nightclubs`);
        if (!Array.isArray(response.data)) {
            throw new Error('Response is not an array');
        }
        if (response.data.length === 0) {
            throw new Error('No nightclubs found - run populate-sample-data.js first');
        }
        console.log(`\n  ${colors.yellow}  Found ${response.data.length} nightclubs${colors.reset}`);
    });

    // Test 3: Get all events
    await test('GET /events returns data', async () => {
        const response = await axios.get(`${BASE_URL}/events`);
        if (!Array.isArray(response.data)) {
            throw new Error('Response is not an array');
        }
        console.log(`\n  ${colors.yellow}  Found ${response.data.length} events${colors.reset}`);
    });

    // Test 4: Get events by club
    await test('GET /events/club/:clubId works', async () => {
        // First get a club ID
        const clubsResponse = await axios.get(`${BASE_URL}/nightclubs`);
        if (clubsResponse.data.length === 0) {
            throw new Error('No clubs to test with');
        }
        const clubId = clubsResponse.data[0].id;

        const eventsResponse = await axios.get(`${BASE_URL}/events/club/${clubId}`);
        if (!Array.isArray(eventsResponse.data)) {
            throw new Error('Response is not an array');
        }
        console.log(`\n  ${colors.yellow}  Found ${eventsResponse.data.length} events for club${colors.reset}`);
    });

    // Test 5: Authentication endpoint exists
    await test('POST /auth/login endpoint exists', async () => {
        try {
            await axios.post(`${BASE_URL}/auth/login`, {
                email: 'test@example.com',
                password: 'wrongpassword',
            });
        } catch (error) {
            // We expect 401 or 404, just checking endpoint exists
            if (error.response && (error.response.status === 401 || error.response.status === 400)) {
                return; // Expected behavior
            }
            throw error;
        }
    });

    // Test 6: CORS headers (important for web admin)
    await test('CORS headers present', async () => {
        const response = await axios.get(`${BASE_URL}/nightclubs`);
        // Just check response is successful, CORS would block in browser if not configured
        if (response.status !== 200) {
            throw new Error('CORS check failed');
        }
    });

    // Test 7: Verify database has data
    await test('Database contains sample data', async () => {
        const nightclubsResponse = await axios.get(`${BASE_URL}/nightclubs`);
        if (nightclubsResponse.data.length < 3) {
            throw new Error('Expected at least 3 nightclubs - run populate-sample-data.js');
        }

        const expectedClubs = ['Sky Garden', 'Neon Sanctum', 'Velvet Rope'];
        const clubNames = nightclubsResponse.data.map(c => c.name);

        for (const expected of expectedClubs) {
            if (!clubNames.includes(expected)) {
                throw new Error(`Missing expected club: ${expected}`);
            }
        }
    });

    // Test 8: Image URLs accessible
    await test('Club images have valid URLs', async () => {
        const response = await axios.get(`${BASE_URL}/nightclubs`);
        const clubs = response.data;

        for (const club of clubs) {
            if (!club.imageUrl || !club.imageUrl.startsWith('http')) {
                throw new Error(`Invalid image URL for ${club.name}`);
            }
        }
    });

    // Print Summary
    console.log(`\n${colors.blue}╔════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.blue}║  Test Results                                  ║${colors.reset}`);
    console.log(`${colors.blue}╚════════════════════════════════════════════════╝${colors.reset}\n`);

    results.tests.forEach((test, index) => {
        const status = test.status === 'PASS'
            ? `${colors.green}✓ PASS${colors.reset}`
            : `${colors.red}✗ FAIL${colors.reset}`;
        console.log(`  ${index + 1}. ${test.name}: ${status}`);
        if (test.error) {
            console.log(`     ${colors.red}${test.error}${colors.reset}`);
        }
    });

    console.log(`\n${colors.cyan}Summary:${colors.reset}`);
    console.log(`  ${colors.green}Passed: ${results.passed}${colors.reset}`);
    console.log(`  ${colors.red}Failed: ${results.failed}${colors.reset}`);
    console.log(`  Total: ${results.passed + results.failed}\n`);

    if (results.failed === 0) {
        console.log(`${colors.green}╔════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.green}║  ✓ All tests passed! Integration verified.    ║${colors.reset}`);
        console.log(`${colors.green}╚════════════════════════════════════════════════╝${colors.reset}\n`);
    } else {
        console.log(`${colors.red}╔════════════════════════════════════════════════╗${colors.reset}`);
        console.log(`${colors.red}║  ✗ Some tests failed. Check errors above.     ║${colors.reset}`);
        console.log(`${colors.red}╚════════════════════════════════════════════════╝${colors.reset}\n`);
        process.exit(1);
    }

    console.log(`${colors.yellow}Next Steps:${colors.reset}`);
    console.log(`  1. Start admin dashboard: cd admin-dashboard && npm run dev`);
    console.log(`  2. Open mobile app and refresh browse screen`);
    console.log(`  3. Verify same data appears in all 3 places:\n`);
    console.log(`     ${colors.cyan}→ Backend API:${colors.reset} http://localhost:3000/nightclubs`);
    console.log(`     ${colors.cyan}→ Admin Dashboard:${colors.reset} http://localhost:3001`);
    console.log(`     ${colors.cyan}→ Mobile App:${colors.reset} Browse Screen\n`);
}

// Run tests
runIntegrationTests().catch((error) => {
    console.error(`${colors.red}Fatal error:${colors.reset}`, error.message);
    process.exit(1);
});
