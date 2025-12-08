# PowerShell Script to Create Yatra Database
# This script will create the database using MySQL

Write-Host "🚀 Creating Yatra Database..." -ForegroundColor Green
Write-Host ""

# Get MySQL root password
$mysqlPassword = Read-Host "Enter MySQL root password (press Enter if no password)" -AsSecureString
$mysqlPasswordPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($mysqlPassword))

# MySQL path
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$schemaPath = Join-Path $PSScriptRoot "database\schema.sql"

# Check if schema file exists
if (-not (Test-Path $schemaPath)) {
    Write-Host "❌ Schema file not found: $schemaPath" -ForegroundColor Red
    exit 1
}

Write-Host "📄 Reading schema file: $schemaPath" -ForegroundColor Cyan
Write-Host ""

# Build MySQL command
if ($mysqlPasswordPlain -eq "") {
    $mysqlCommand = "& `"$mysqlPath`" -u root < `"$schemaPath`""
} else {
    $mysqlCommand = "& `"$mysqlPath`" -u root -p$mysqlPasswordPlain < `"$schemaPath`""
}

try {
    Write-Host "🔨 Creating database and tables..." -ForegroundColor Yellow
    
    # Read schema content
    $schemaContent = Get-Content $schemaPath -Raw
    
    # Execute MySQL command
    if ($mysqlPasswordPlain -eq "") {
        $schemaContent | & $mysqlPath -u root
    } else {
        $schemaContent | & $mysqlPath -u root -p$mysqlPasswordPlain
    }
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Database 'yatra_db' created successfully!" -ForegroundColor Green
        Write-Host "✅ All tables created successfully!" -ForegroundColor Green
        Write-Host "✅ Default data inserted!" -ForegroundColor Green
        Write-Host ""
        Write-Host "🎉 Database setup complete!" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Next steps:" -ForegroundColor Cyan
        Write-Host "   1. Create .env file with your MySQL credentials"
        Write-Host "   2. Run: npm install"
        Write-Host "   3. Run: npm start"
    } else {
        Write-Host ""
        Write-Host "❌ Error creating database. Check your MySQL password and try again." -ForegroundColor Red
    }
} catch {
    Write-Host ""
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Troubleshooting:" -ForegroundColor Yellow
    Write-Host "   - Make sure MySQL server is running"
    Write-Host "   - Verify your MySQL root password"
    Write-Host "   - Check that MySQL service is started in Services"
}

