/**
 * Migration Script: localStorage to MySQL Database
 * 
 * This script helps migrate data from browser localStorage to MySQL database.
 * 
 * Instructions:
 * 1. Open your website in browser
 * 2. Open browser console (F12)
 * 3. Run: JSON.stringify(localStorage, null, 2)
 * 4. Copy the output and save to a file (e.g., localStorage-backup.json)
 * 5. Update the file path below
 * 6. Run: node scripts/migrate-localStorage-to-db.js
 */

const fs = require('fs');
const path = require('path');
const { query } = require('../config/database');
const bcrypt = require('bcrypt');

// Path to localStorage backup JSON file
const BACKUP_FILE = path.join(__dirname, '../localStorage-backup.json');

async function migrateTravelers(travelers) {
    console.log(`📦 Migrating ${travelers.length} travelers...`);
    
    for (const traveler of travelers) {
        try {
            // Hash password
            const passwordHash = traveler.password 
                ? await bcrypt.hash(traveler.password, 10)
                : await bcrypt.hash('default123', 10);
            
            await query(`
                INSERT INTO travelers (
                    tirth_id, first_name, middle_name, last_name, email, password_hash,
                    phone, city, country, center, birth_date, age, passport_no,
                    passport_issue_date, passport_expiry_date, nationality, gender,
                    hoodi_size, vehicle_id, profile_line, about_me, image_url
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    first_name = VALUES(first_name),
                    last_name = VALUES(last_name),
                    phone = VALUES(phone),
                    city = VALUES(city)
            `, [
                traveler.tirthId || `TY${String(traveler.id).padStart(3, '0')}`,
                traveler.firstName,
                traveler.middleName || '',
                traveler.lastName,
                traveler.email,
                passwordHash,
                traveler.phone,
                traveler.city,
                traveler.country || 'India',
                traveler.center,
                traveler.birthDate || null,
                traveler.age ? parseInt(traveler.age) : null,
                traveler.passportNo,
                traveler.passportIssueDate || null,
                traveler.passportExpiryDate || null,
                traveler.nationality || 'Indian',
                traveler.gender || 'Male',
                traveler.hoodiSize,
                traveler.vehicleId || null,
                traveler.profileLine,
                traveler.aboutMe,
                traveler.image || ''
            ]);
            
            console.log(`  ✅ Migrated: ${traveler.name} (${traveler.email})`);
        } catch (error) {
            console.error(`  ❌ Error migrating ${traveler.email}:`, error.message);
        }
    }
}

async function migrateItinerary(itinerary) {
    console.log(`📅 Migrating ${itinerary.length} itinerary days...`);
    
    for (const day of itinerary) {
        try {
            // Parse date
            const dateObj = day.dateObj ? new Date(day.dateObj) : new Date(day.date);
            
            const result = await query(`
                INSERT INTO itinerary (day, date, place, city, state, country, lat, lng, description)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    place = VALUES(place),
                    lat = VALUES(lat),
                    lng = VALUES(lng)
            `, [
                day.day,
                dateObj.toISOString().split('T')[0],
                day.place,
                day.city,
                day.state,
                day.country || 'India',
                day.lat,
                day.lng,
                day.description || ''
            ]);
            
            const itineraryId = result.insertId || day.id;
            
            // Migrate activities
            if (day.activities && day.activities.length > 0) {
                await query('DELETE FROM itinerary_activities WHERE itinerary_id = ?', [itineraryId]);
                for (let i = 0; i < day.activities.length; i++) {
                    await query(`
                        INSERT INTO itinerary_activities (itinerary_id, time, activity, display_order)
                        VALUES (?, ?, ?, ?)
                    `, [itineraryId, day.activities[i].time, day.activities[i].activity, i]);
                }
            }
            
            // Migrate images
            if (day.images && day.images.length > 0) {
                await query('DELETE FROM itinerary_images WHERE itinerary_id = ?', [itineraryId]);
                for (let i = 0; i < day.images.length; i++) {
                    await query(`
                        INSERT INTO itinerary_images (itinerary_id, image_url, display_order)
                        VALUES (?, ?, ?)
                    `, [itineraryId, day.images[i], i]);
                }
            }
            
            console.log(`  ✅ Migrated: Day ${day.day} - ${day.place}`);
        } catch (error) {
            console.error(`  ❌ Error migrating day ${day.day}:`, error.message);
        }
    }
}

async function migrateVehicles(vehicles) {
    console.log(`🚌 Migrating ${vehicles.length} vehicles...`);
    
    for (const vehicle of vehicles) {
        try {
            await query(`
                INSERT INTO vehicles (
                    name, type, capacity, reg_no, group_leader_email,
                    group_leader_name, driver_name, driver_phone, color, status, notes
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    name = VALUES(name),
                    status = VALUES(status)
            `, [
                vehicle.name,
                vehicle.type,
                vehicle.capacity,
                vehicle.regNo,
                vehicle.groupLeaderEmail,
                vehicle.groupLeaderName,
                vehicle.driver,
                vehicle.driverPhone,
                vehicle.color || '#FF9933',
                vehicle.status || 'Active',
                vehicle.notes || ''
            ]);
            
            console.log(`  ✅ Migrated: ${vehicle.name}`);
        } catch (error) {
            console.error(`  ❌ Error migrating vehicle ${vehicle.name}:`, error.message);
        }
    }
}

async function migratePosts(posts) {
    console.log(`📝 Migrating ${posts.length} posts...`);
    
    for (const post of posts) {
        try {
            const result = await query(`
                INSERT INTO posts (
                    author_email, author_name, author_image_url, place, location,
                    section_id, description, lat, lng, approved, created_at
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                post.email || post.authorEmail,
                post.author || post.authorName,
                post.authorImage || '',
                post.place,
                post.location,
                post.section || null,
                post.description || '',
                post.lat || null,
                post.lng || null,
                post.approved !== undefined ? post.approved : false,
                post.timestamp ? new Date(post.timestamp) : new Date()
            ]);
            
            const postId = result.insertId;
            
            // Migrate media
            if (post.media && post.media.length > 0) {
                for (let i = 0; i < post.media.length; i++) {
                    await query(`
                        INSERT INTO post_media (post_id, media_url, display_order)
                        VALUES (?, ?, ?)
                    `, [postId, post.media[i], i]);
                }
            }
            
            // Migrate tags
            if (post.tags && post.tags.length > 0) {
                for (const tag of post.tags) {
                    await query(`
                        INSERT INTO post_tags (post_id, tag_name)
                        VALUES (?, ?)
                        ON DUPLICATE KEY UPDATE post_id = post_id
                    `, [postId, tag]);
                }
            }
            
            console.log(`  ✅ Migrated: Post ${postId} - ${post.place}`);
        } catch (error) {
            console.error(`  ❌ Error migrating post:`, error.message);
        }
    }
}

async function migrateRoomPairs(roomPairs) {
    console.log(`🤝 Migrating ${roomPairs.length} room pairs...`);
    
    for (const pair of roomPairs) {
        try {
            const result = await query(`
                INSERT INTO room_pairs (pair_no)
                VALUES (?)
                ON DUPLICATE KEY UPDATE pair_no = pair_no
            `, [pair.pairNo]);
            
            const pairId = result.insertId || pair.id;
            
            // Migrate traveler relationships
            if (pair.travelerIds && pair.travelerIds.length > 0) {
                await query('DELETE FROM room_pair_travelers WHERE room_pair_id = ?', [pairId]);
                for (const travelerId of pair.travelerIds) {
                    await query(`
                        INSERT INTO room_pair_travelers (room_pair_id, traveler_id)
                        VALUES (?, ?)
                    `, [pairId, travelerId]);
                }
            }
            
            console.log(`  ✅ Migrated: Pair ${pair.pairNo}`);
        } catch (error) {
            console.error(`  ❌ Error migrating pair ${pair.pairNo}:`, error.message);
        }
    }
}

async function migrateSettings(settings) {
    console.log(`⚙️  Migrating settings...`);
    
    for (const [key, value] of Object.entries(settings)) {
        try {
            let settingValue = value;
            let settingType = 'string';
            
            if (typeof value === 'object') {
                settingValue = JSON.stringify(value);
                settingType = 'json';
            } else if (typeof value === 'boolean') {
                settingValue = value.toString();
                settingType = 'boolean';
            } else if (typeof value === 'number') {
                settingValue = value.toString();
                settingType = 'number';
            }
            
            await query(`
                INSERT INTO settings (setting_key, setting_value, setting_type)
                VALUES (?, ?, ?)
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value)
            `, [key, settingValue, settingType]);
            
            console.log(`  ✅ Migrated: ${key}`);
        } catch (error) {
            console.error(`  ❌ Error migrating setting ${key}:`, error.message);
        }
    }
}

async function main() {
    console.log('🚀 Starting migration from localStorage to MySQL...\n');
    
    // Check if backup file exists
    if (!fs.existsSync(BACKUP_FILE)) {
        console.error(`❌ Backup file not found: ${BACKUP_FILE}`);
        console.log('\n📋 To create backup:');
        console.log('1. Open your website in browser');
        console.log('2. Open browser console (F12)');
        console.log('3. Run: JSON.stringify(localStorage, null, 2)');
        console.log('4. Copy output and save to:', BACKUP_FILE);
        process.exit(1);
    }
    
    // Read backup file
    const backupData = JSON.parse(fs.readFileSync(BACKUP_FILE, 'utf8'));
    
    // Parse localStorage data
    const travelers = backupData.authorizedTravelers 
        ? JSON.parse(backupData.authorizedTravelers) 
        : [];
    const itinerary = backupData.itinerary 
        ? JSON.parse(backupData.itinerary) 
        : [];
    const vehicles = backupData.vehicles 
        ? JSON.parse(backupData.vehicles) 
        : [];
    const posts = backupData.posts 
        ? JSON.parse(backupData.posts) 
        : [];
    const roomPairs = backupData.roomPairs 
        ? JSON.parse(backupData.roomPairs) 
        : [];
    const settings = backupData.yatraSettings 
        ? JSON.parse(backupData.yatraSettings) 
        : {};
    
    try {
        // Migrate data
        if (travelers.length > 0) await migrateTravelers(travelers);
        if (itinerary.length > 0) await migrateItinerary(itinerary);
        if (vehicles.length > 0) await migrateVehicles(vehicles);
        if (posts.length > 0) await migratePosts(posts);
        if (roomPairs.length > 0) await migrateRoomPairs(roomPairs);
        if (Object.keys(settings).length > 0) await migrateSettings(settings);
        
        console.log('\n✅ Migration completed successfully!');
    } catch (error) {
        console.error('\n❌ Migration failed:', error);
        process.exit(1);
    }
}

// Run migration
main();

