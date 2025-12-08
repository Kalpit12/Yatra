# Yatra Admin Panel - Localhost Setup Guide

## Quick Start

### 1. Start Backend Server
```bash
# Navigate to your backend directory (where server.js is located)
cd path/to/backend

# Start the server
npm start

# Server should be running on: http://localhost:3000
```

### 2. Start Frontend (HTML File)

**Option A: Using VS Code Live Server**
- Install "Live Server" extension in VS Code
- Right-click on `Yatra_Admin_Working.html`
- Select "Open with Live Server"
- Opens automatically at: http://localhost:5500

**Option B: Using Python**
```bash
# Navigate to YATRA directory
cd d:\YATRA

# Start Python HTTP server
python -m http.server 5500

# Open browser: http://localhost:5500/Yatra_Admin_Working.html
```

**Option C: Using Node.js http-server**
```bash
# Install http-server globally (one time)
npm install -g http-server

# Navigate to YATRA directory
cd d:\YATRA

# Start server
http-server -p 5500

# Open browser: http://localhost:5500/Yatra_Admin_Working.html
```

### 3. Login
- **Username:** `admin`
- **Password:** `yatra@2024`

## File Structure

```
d:\YATRA\
├── Yatra_Admin_Working.html    ← Main admin panel file
├── api-integration.js           ← API connection (must be in same directory)
└── (other files...)
```

## API Configuration

The admin panel connects to your backend API at:
- **Base URL:** `http://localhost:3000/api`

This is configured in `api-integration.js`:
```javascript
const API_BASE = 'http://localhost:3000/api';
```

## Troubleshooting

### Issue: "Cannot connect to backend API"
**Solution:**
1. Make sure backend server is running: `npm start`
2. Check server is on port 3000: http://localhost:3000
3. Verify MySQL is running and connected
4. Check browser console for detailed error messages

### Issue: "api-integration.js not found"
**Solution:**
1. Make sure `api-integration.js` is in the same directory as `Yatra_Admin_Working.html`
2. Check browser console for 404 errors
3. Verify file paths are correct

### Issue: "CORS error"
**Solution:**
1. Make sure your backend has CORS enabled
2. Backend should allow requests from: `http://localhost:5500` (or your frontend port)
3. Check backend server logs for CORS errors

### Issue: "Data not displaying"
**Solution:**
1. Check browser console (F12) for errors
2. Verify backend API endpoints are working: http://localhost:3000/api/travelers
3. Check MySQL connection in backend
4. Clear browser cache and reload

## Testing API Connection

Open browser console (F12) and check for:
- ✅ "Backend API is connected and working!"
- ❌ "Cannot connect to backend API" (means server is not running)

## Features Working on Localhost

✅ All data loads from MySQL via API
✅ Travelers management (Add, Edit, Delete)
✅ Room Pairs management (Create, Edit, Delete)
✅ Posts management
✅ Vehicles management
✅ Hotels management
✅ Itinerary management
✅ Tags management
✅ Session persistence (stays logged in on refresh)

## Next Steps

1. Start backend: `npm start`
2. Open admin panel in browser
3. Login with admin credentials
4. All data should load automatically from MySQL!

