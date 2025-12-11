const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
    // Railway MySQL connection details
    const connection = await mysql.createConnection({
        host: 'turntable.proxy.rlwy.net',
        user: 'root',
        password: 'bnKrLyyGkdrJihZoHqUNJtbTdMzQIDer',
        port: 21700,
        database: 'railway',
        multipleStatements: true // Allow multiple SQL statements
    });

    console.log('✅ Connected to Railway MySQL database');

    try {
        // Read the SQL file
        const sqlFile = path.join(__dirname, 'database-setup.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log('📄 Running database setup SQL...');
        
        // Execute the SQL
        await connection.query(sql);
        
        console.log('✅ Database setup completed successfully!');
        console.log('✅ All tables created');
        console.log('✅ Default data inserted');
        
        // Verify tables were created
        const [tables] = await connection.query('SHOW TABLES');
        console.log('\n📊 Created tables:');
        tables.forEach(table => {
            console.log(`   - ${Object.values(table)[0]}`);
        });

    } catch (error) {
        console.error('❌ Error setting up database:', error.message);
        if (error.sql) {
            console.error('SQL Error:', error.sql);
        }
        process.exit(1);
    } finally {
        await connection.end();
        console.log('\n✅ Connection closed');
    }
}

setupDatabase();

