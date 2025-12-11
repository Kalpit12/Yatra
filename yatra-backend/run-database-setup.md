# How to Run Database Setup

## Method 1: Using MySQL Command Line

1. **Install MySQL Client** (if not installed):
   - Download from: https://dev.mysql.com/downloads/mysql/
   - Or use: `winget install Oracle.MySQL` (Windows)

2. **Get your password from Railway**:
   - Click "show" next to password in Railway MySQL connect modal
   - Copy the password

3. **Run this command** (replace YOUR_PASSWORD):
   ```bash
   mysql -h turntable.proxy.rlwy.net -u root -pYOUR_PASSWORD --port 21700 railway < database-setup.sql
   ```

   Or connect interactively:
   ```bash
   mysql -h turntable.proxy.rlwy.net -u root -p --port 21700 railway
   ```
   Then paste the SQL file contents.

## Method 2: Using MySQL Workbench (GUI)

1. Download MySQL Workbench: https://dev.mysql.com/downloads/workbench/
2. Create new connection:
   - Host: `turntable.proxy.rlwy.net`
   - Port: `21700`
   - Username: `root`
   - Password: (from Railway)
   - Database: `railway`
3. Connect, then open `database-setup.sql` and run it

## Method 3: Using Railway CLI

```bash
railway connect MySQL
```
Then paste the SQL file contents.

