/**
 * Add Sample Data to Database
 * Run: node add-sample-data.js
 */

const { query } = require('./config/database');
const bcrypt = require('bcrypt');

async function addSampleData() {
    try {
        console.log('\n📝 Adding Sample Data to Database...\n');
        
        // Check if data already exists
        const [travelerCount] = await query('SELECT COUNT(*) as count FROM travelers');
        if (travelerCount.count > 0) {
            console.log('⚠️  Database already has data. Skipping...');
            console.log(`   Current travelers: ${travelerCount.count}`);
            return;
        }
        
        // Add Sample Travelers
        console.log('👥 Adding sample travelers...');
        const sampleTravelers = [
            { tirthId: 'TY001', firstName: 'Aarav', lastName: 'Sharma', email: 'aarav.sharma1@yatra.com', city: 'Mumbai' },
            { tirthId: 'TY002', firstName: 'Vivaan', lastName: 'Patel', email: 'vivaan.patel2@yatra.com', city: 'Delhi' },
            { tirthId: 'TY003', firstName: 'Aditya', lastName: 'Kumar', email: 'aditya.kumar3@yatra.com', city: 'Bangalore' },
            { tirthId: 'TY004', firstName: 'Vihaan', lastName: 'Singh', email: 'vihaan.singh4@yatra.com', city: 'Hyderabad' },
            { tirthId: 'TY005', firstName: 'Arjun', lastName: 'Gupta', email: 'arjun.gupta5@yatra.com', city: 'Chennai' },
            { tirthId: 'TY006', firstName: 'Sai', lastName: 'Reddy', email: 'sai.reddy6@yatra.com', city: 'Pune' },
            { tirthId: 'TY007', firstName: 'Arnav', lastName: 'Rao', email: 'arnav.rao7@yatra.com', city: 'Kolkata' },
            { tirthId: 'TY008', firstName: 'Ayaan', lastName: 'Nair', email: 'ayaan.nair8@yatra.com', city: 'Ahmedabad' },
            { tirthId: 'TY009', firstName: 'Krishna', lastName: 'Iyer', email: 'krishna.iyer9@yatra.com', city: 'Jaipur' },
            { tirthId: 'TY010', firstName: 'Ishaan', lastName: 'Mehta', email: 'ishaan.mehta10@yatra.com', city: 'Surat' }
        ];
        
        const passwordHash = await bcrypt.hash('password123', 10);
        
        for (const traveler of sampleTravelers) {
            await query(`
                INSERT INTO travelers (
                    tirth_id, first_name, last_name, email, password_hash,
                    phone, city, country, nationality, gender, age
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                traveler.tirthId,
                traveler.firstName,
                traveler.lastName,
                traveler.email,
                passwordHash,
                `+91-980000000${traveler.tirthId.slice(-1)}`,
                traveler.city,
                'India',
                'Indian',
                'Male',
                25 + parseInt(traveler.tirthId.slice(-1))
            ]);
        }
        console.log(`   ✅ Added ${sampleTravelers.length} travelers`);
        
        // Add Sample Vehicles
        console.log('\n🚌 Adding sample vehicles...');
        const sampleVehicles = [
            {
                name: 'Swift Journey Alpha',
                type: 'Tourist Bus',
                capacity: 25,
                regNo: 'MH-01-YT-2024',
                groupLeaderName: 'Aarav Sharma',
                groupLeaderEmail: 'aarav.sharma1@yatra.com',
                driver: 'Rajesh Kumar',
                driverPhone: '+91-9800001000',
                color: '#FF9933',
                status: 'Active'
            },
            {
                name: 'Swift Journey Beta',
                type: 'Tourist Bus',
                capacity: 25,
                regNo: 'DL-02-YT-2024',
                groupLeaderName: 'Vivaan Patel',
                groupLeaderEmail: 'vivaan.patel2@yatra.com',
                driver: 'Mahesh Singh',
                driverPhone: '+91-9800002000',
                color: '#138808',
                status: 'Active'
            },
            {
                name: 'Swift Journey Gamma',
                type: 'Tourist Bus',
                capacity: 25,
                regNo: 'KA-03-YT-2024',
                groupLeaderName: 'Aditya Kumar',
                groupLeaderEmail: 'aditya.kumar3@yatra.com',
                driver: 'Suresh Yadav',
                driverPhone: '+91-9800003000',
                color: '#000080',
                status: 'Active'
            }
        ];
        
        for (const vehicle of sampleVehicles) {
            await query(`
                INSERT INTO vehicles (
                    name, type, capacity, reg_no, group_leader_name,
                    group_leader_email, driver_name, driver_phone, color, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                vehicle.name,
                vehicle.type,
                vehicle.capacity,
                vehicle.regNo,
                vehicle.groupLeaderName,
                vehicle.groupLeaderEmail,
                vehicle.driver,
                vehicle.driverPhone,
                vehicle.color,
                vehicle.status
            ]);
        }
        console.log(`   ✅ Added ${sampleVehicles.length} vehicles`);
        
        // Update travelers with vehicle assignments
        console.log('\n🔗 Assigning travelers to vehicles...');
        const [vehicle1] = await query('SELECT id FROM vehicles WHERE name = ?', ['Swift Journey Alpha']);
        const [vehicle2] = await query('SELECT id FROM vehicles WHERE name = ?', ['Swift Journey Beta']);
        const [vehicle3] = await query('SELECT id FROM vehicles WHERE name = ?', ['Swift Journey Gamma']);
        
        await query('UPDATE travelers SET vehicle_id = ? WHERE tirth_id IN (?, ?, ?, ?)', 
            [vehicle1.id, 'TY001', 'TY002', 'TY003', 'TY004']);
        await query('UPDATE travelers SET vehicle_id = ? WHERE tirth_id IN (?, ?, ?, ?)', 
            [vehicle2.id, 'TY005', 'TY006', 'TY007', 'TY008']);
        await query('UPDATE travelers SET vehicle_id = ? WHERE tirth_id IN (?, ?)', 
            [vehicle3.id, 'TY009', 'TY010']);
        console.log('   ✅ Travelers assigned to vehicles');
        
        // Add Sample Itinerary
        console.log('\n🗺️  Adding sample itinerary...');
        const itineraryDays = [
            {
                day: 1,
                date: '2025-12-14',
                place: 'BAPS Dadar Mandir',
                city: 'Mumbai',
                state: 'Maharashtra',
                country: 'India',
                lat: 19.0176,
                lng: 72.8561,
                description: 'Journey begins at BAPS Dadar Mandir with spiritual preparation',
                activities: [
                    { time: '2:00 PM', activity: 'Arrive at BAPS Dadar Mandir, Mumbai' },
                    { time: '5:00 PM', activity: 'Satsang sabha labh at Yogi sabha gruh' },
                    { time: '8:00 PM', activity: 'Pre-departure orientation' },
                    { time: '9:00 PM', activity: 'Rest - Night stay in Mumbai' }
                ]
            },
            {
                day: 2,
                date: '2025-12-15',
                place: 'Biratnagar',
                city: 'Biratnagar',
                state: 'Koshi Province',
                country: 'Nepal',
                lat: 26.4525,
                lng: 87.2718,
                description: 'Cross international border into Nepal',
                activities: [
                    { time: '7:10 AM', activity: 'Leave for airport' },
                    { time: '10:15 AM', activity: 'Departure flight Mumbai to Darbhanga' },
                    { time: '12:45 PM', activity: 'Arrival at Darbhanga (Bihar)' },
                    { time: '1:30 PM', activity: 'Transfer to Nepal Border - Jogbani' }
                ]
            }
        ];
        
        for (const day of itineraryDays) {
            const result = await query(`
                INSERT INTO itinerary (day, date, place, city, state, country, lat, lng, description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                day.day, day.date, day.place, day.city, day.state, day.country,
                day.lat, day.lng, day.description
            ]);
            
            const itineraryId = result.insertId;
            
            for (let i = 0; i < day.activities.length; i++) {
                await query(`
                    INSERT INTO itinerary_activities (itinerary_id, time, activity, display_order)
                    VALUES (?, ?, ?, ?)
                `, [itineraryId, day.activities[i].time, day.activities[i].activity, i]);
            }
        }
        console.log(`   ✅ Added ${itineraryDays.length} itinerary days`);
        
        console.log('\n' + '='.repeat(50));
        console.log('✅ Sample Data Added Successfully!');
        console.log('='.repeat(50));
        console.log('\n📊 Summary:');
        console.log(`   👥 Travelers: ${sampleTravelers.length}`);
        console.log(`   🚌 Vehicles: ${sampleVehicles.length}`);
        console.log(`   🗺️  Itinerary Days: ${itineraryDays.length}`);
        console.log('\n✅ You can now view data in MySQL Workbench!');
        console.log('   Or check: http://localhost:3000/api/travelers\n');
        
    } catch (error) {
        console.error('\n❌ Error adding sample data:', error.message);
        console.log('\n💡 Make sure:');
        console.log('   1. MySQL is running (start-mysql-user.bat)');
        console.log('   2. Server is running (npm start)');
        console.log('   3. Database exists (yatra_db)\n');
        process.exit(1);
    }
}

// Run if called directly
if (require.main === module) {
    addSampleData().then(() => process.exit(0)).catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });
}

module.exports = { addSampleData };

