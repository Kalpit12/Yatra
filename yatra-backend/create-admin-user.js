const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');

async function createAdminUser() {
    const requiredEnv = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_PORT', 'DB_NAME', 'ADMIN_PASSWORD'];
    const missing = requiredEnv.filter(key => !process.env[key]);
    if (missing.length) {
        throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
        database: process.env.DB_NAME
    });

    console.log('✅ Connected to MySQL database');

    try {
        // Hash the password
        const passwordHash = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
        
        console.log('🔐 Creating admin user...');
        console.log('   Email: admin@yatra.com');
        console.log('   Password: [hidden]');
        
        // Insert admin user
        await connection.query(
            `INSERT INTO admin_users (name, email, password_hash, include_in_contributors, image_compression_quality)
             VALUES (?, ?, ?, ?, ?)
             ON DUPLICATE KEY UPDATE 
                password_hash = VALUES(password_hash),
                name = VALUES(name)`,
            ['Admin', 'admin@yatra.com', passwordHash, true, 0.85]
        );
        
        console.log('✅ Admin user created successfully!');
        console.log('\n📋 Admin Login Credentials:');
        console.log('   Username: admin (or admin@yatra.com)');
        console.log('   Password: yatra@2024');
        
        // Also create a user with username "admin" for compatibility
        await connection.query(
            `UPDATE admin_users SET name = 'admin' WHERE email = 'admin@yatra.com'`
        );
        
    } catch (error) {
        console.error('❌ Error creating admin user:', error.message);
        if (error.sql) {
            console.error('SQL Error:', error.sql);
        }
        process.exit(1);
    } finally {
        await connection.end();
        console.log('\n✅ Connection closed');
    }
}

createAdminUser();

