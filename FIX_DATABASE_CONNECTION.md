# 🔧 Fix Database Connection Error

## Problem
```
❌ Database connection failed: ECONNREFUSED
```

This means MySQL is not running or not accessible.

## ✅ Quick Fix Steps

### Step 1: Start MySQL Service

**Option A: Using Script (Easiest)**
```batch
start-mysql.bat
```

**Option B: Manual Start (Run as Administrator)**
```batch
net start MySQL80
```

**Option C: Using Services GUI**
1. Press `Win + R`
2. Type `services.msc` and press Enter
3. Find "MySQL80" or "MySQL"
4. Right-click → Start

### Step 2: Create .env File

Create a `.env` file in the root directory (`D:\YATRA\.env`):

```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=yatra_db
DB_PORT=3306

# Server Configuration
PORT=3000
NODE_ENV=development

# JWT Secret
JWT_SECRET=yatra_secret_key_change_in_production_min_32_chars

# CORS Configuration
CORS_ORIGIN=http://localhost:80,http://localhost:8080,http://localhost:5500
```

**Important:** Replace `your_mysql_password` with your actual MySQL root password.

### Step 3: Create Database

Run the database creation script:
```batch
create-database.bat
```

Or manually:
```sql
CREATE DATABASE IF NOT EXISTS yatra_db;
```

### Step 4: Verify Connection

Test if MySQL is running:
```batch
mysql -u root -p -e "SHOW DATABASES;"
```

### Step 5: Restart Server

After MySQL is running and .env is created:
```batch
node server.js
```

## 🔍 Troubleshooting

### MySQL Not Installed?
1. Download MySQL: https://dev.mysql.com/downloads/installer/
2. Install MySQL Server
3. Remember the root password you set during installation

### Forgot MySQL Password?
1. Stop MySQL service: `net stop MySQL80`
2. Start MySQL in safe mode: `mysqld --skip-grant-tables`
3. Reset password: `mysql -u root` then `ALTER USER 'root'@'localhost' IDENTIFIED BY 'newpassword';`
4. Restart MySQL service

### Using Docker Instead?
If you prefer Docker, use:
```batch
docker-compose -f docker-compose.all.yml up -d
```

This will start MySQL in a container automatically.

## ✅ Success Indicators

When working correctly, you should see:
```
✅ Database connected successfully!
🚀 Yatra API Server running on http://localhost:3000
```

