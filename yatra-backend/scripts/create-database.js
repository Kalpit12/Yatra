/**
 * Database Creation Script
 * 
 * This script creates the Yatra database and all tables.
 * 
 * Usage: node scripts/create-database.js
 * 
 * Make sure MySQL is running and credentials in .env are correct.
 */

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function createDatabase() {
    console.log('🚀 Starting database creation...\n');
    
    let connection;
    
    try {
        // Connect to MySQL (without specifying database)
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            port: process.env.DB_PORT || 3306,
            multipleStatements: true
        });
        
        console.log('✅ Connected to MySQL server\n');
        
        // Read schema file
        const schemaPath = path.join(__dirname, '../database/schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('📄 Reading schema file...');
        console.log('🔨 Creating database and tables...\n');
        
        // Execute schema
        await connection.query(schema);
        
        console.log('✅ Database "yatra_db" created successfully!');
        console.log('✅ All tables created successfully!');
        console.log('✅ Default data inserted!\n');
        
        // Verify tables were created
        const [tables] = await connection.query(`
            SELECT TABLE_NAME 
            FROM information_schema.TABLES 
            WHERE TABLE_SCHEMA = 'yatra_db'
            ORDER BY TABLE_NAME
        `);
        
        console.log('📊 Created tables:');
        tables.forEach(table => {
            console.log(`   ✓ ${table.TABLE_NAME}`);
        });
        
        console.log(`\n✅ Total tables created: ${tables.length}`);
        console.log('\n🎉 Database setup complete!');
        console.log('\n📝 Next steps:');
        console.log('   1. Update .env file with your MySQL credentials');
        console.log('   2. Run: npm install');
        console.log('   3. Run: npm start');
        
    } catch (error) {
        console.error('\n❌ Error creating database:', error.message);
        
        if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('\n💡 Tip: Check your MySQL username and password in .env file');
        } else if (error.code === 'ECONNREFUSED') {
            console.error('\n💡 Tip: Make sure MySQL server is running');
            console.error('   Windows: Check Services or start MySQL from XAMPP/WAMP');
            console.error('   Mac/Linux: Run "sudo service mysql start" or "brew services start mysql"');
        } else if (error.code === 'ER_DB_CREATE_EXISTS') {
            console.error('\n💡 Database already exists. To recreate, drop it first:');
            console.error('   DROP DATABASE IF EXISTS yatra_db;');
        }
        
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
            console.log('\n🔌 Connection closed');
        }
    }
}

// Run script
createDatabase();

