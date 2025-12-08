/**
 * Quick Database Viewer Script
 * Run: node view-database.js
 */

const { query } = require('./config/database');

async function viewDatabase() {
    try {
        console.log('\n📊 Yatra Database Contents\n');
        console.log('='.repeat(50));
        
        // Get counts
        const travelers = await query('SELECT COUNT(*) as count FROM travelers');
        const vehicles = await query('SELECT COUNT(*) as count FROM vehicles');
        const posts = await query('SELECT COUNT(*) as count FROM posts');
        const itinerary = await query('SELECT COUNT(*) as count FROM itinerary');
        const pairs = await query('SELECT COUNT(*) as count FROM room_pairs');
        const checkins = await query('SELECT COUNT(*) as count FROM check_ins WHERE active = 1');
        const hotels = await query('SELECT COUNT(*) as count FROM hotels');
        
        console.log(`👥 Travelers:        ${travelers[0].count}`);
        console.log(`🚌 Vehicles:         ${vehicles[0].count}`);
        console.log(`📝 Posts:            ${posts[0].count}`);
        console.log(`🗺️  Itinerary Days:   ${itinerary[0].count}`);
        console.log(`🤝 Room Pairs:       ${pairs[0].count}`);
        console.log(`✅ Active Check-ins: ${checkins[0].count}`);
        console.log(`🏨 Hotels:           ${hotels[0].count}`);
        
        console.log('\n' + '='.repeat(50));
        console.log('\n📋 Sample Data:\n');
        
        // Sample Travelers
        const sampleTravelers = await query('SELECT id, tirth_id, first_name, last_name, email, city FROM travelers LIMIT 5');
        if (sampleTravelers.length > 0) {
            console.log('👥 Travelers (first 5):');
            sampleTravelers.forEach(t => {
                console.log(`   ${t.id}. ${t.tirth_id} - ${t.first_name} ${t.last_name} (${t.email}) - ${t.city || 'N/A'}`);
            });
        } else {
            console.log('👥 Travelers: (none)');
        }
        
        // Sample Vehicles
        const sampleVehicles = await query('SELECT id, name, type, capacity, status FROM vehicles LIMIT 5');
        if (sampleVehicles.length > 0) {
            console.log('\n🚌 Vehicles (first 5):');
            sampleVehicles.forEach(v => {
                console.log(`   ${v.id}. ${v.name} (${v.type}, Capacity: ${v.capacity}, Status: ${v.status})`);
            });
        } else {
            console.log('\n🚌 Vehicles: (none)');
        }
        
        // Sample Posts
        const samplePosts = await query('SELECT id, author_name, place, location, approved, created_at FROM posts LIMIT 5');
        if (samplePosts.length > 0) {
            console.log('\n📝 Posts (first 5):');
            samplePosts.forEach(p => {
                const status = p.approved ? '✅ Approved' : '⏳ Pending';
                console.log(`   ${p.id}. ${p.author_name} - ${p.place || p.location} (${status})`);
            });
        } else {
            console.log('\n📝 Posts: (none)');
        }
        
        // Settings
        const settings = await query('SELECT setting_key, setting_value FROM settings LIMIT 10');
        if (settings.length > 0) {
            console.log('\n⚙️  Settings:');
            settings.forEach(s => {
                let value = s.setting_value;
                if (value && value.length > 50) {
                    value = value.substring(0, 50) + '...';
                }
                console.log(`   ${s.setting_key}: ${value}`);
            });
        }
        
        console.log('\n' + '='.repeat(50));
        console.log('\n✅ Database access successful!\n');
        
    } catch (error) {
        console.error('\n❌ Error accessing database:', error.message);
        console.log('\n💡 Make sure:');
        console.log('   1. MySQL is running (start-mysql-user.bat)');
        console.log('   2. Server is running (npm start)');
        console.log('   3. .env file is configured correctly\n');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    viewDatabase().then(() => process.exit(0)).catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
}

module.exports = { viewDatabase };

