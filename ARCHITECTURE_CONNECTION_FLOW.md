# 🔗 How HTML Files Connect to SQL Database

## Connection Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    HTML FILES (Frontend)                         │
│  ┌──────────────────────┐      ┌──────────────────────┐       │
│  │  Admin Panel         │      │  Website              │       │
│  │  index.html          │      │  index.html           │       │
│  └──────────┬───────────┘      └──────────┬─────────────┘       │
│             │                            │                      │
│             │ <script src="api-integration.js">                 │
│             │                            │                      │
│             └────────────┬───────────────┘                      │
│                          │                                      │
└──────────────────────────┼──────────────────────────────────────┘
                            │
                            │ HTTP Requests (fetch API)
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│              api-integration.js (Client-Side)                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  API_BASE Configuration:                                  │   │
│  │  • Local: http://localhost:3000/api                      │   │
│  │  • Production: https://yatra-production.up.railway.app/api│   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  Methods:                                                        │
│  • api.getTravelers()      → GET /api/travelers                 │
│  • api.createTraveler()    → POST /api/travelers                │
│  • api.getVehicles()       → GET /api/vehicles                  │
│  • api.createVehicle()     → POST /api/vehicles                  │
│  • api.getItinerary()      → GET /api/itinerary                 │
│  • api.createItineraryDay()→ POST /api/itinerary                │
│  • ... and more                                                │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            │ REST API Calls (JSON)
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│              Backend API Server (Node.js/Express)                │
│                    server.js (Port 3000)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Routes:                                                  │   │
│  │  • /api/travelers  → routes/travelers.js                 │   │
│  │  • /api/vehicles   → routes/vehicles.js                  │   │
│  │  • /api/itinerary  → routes/itinerary.js                 │   │
│  │  • /api/posts      → routes/posts.js                     │   │
│  │  • /api/hotels     → routes/hotels.js                    │   │
│  │  • ...                                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Database Connection:                                     │   │
│  │  config/database.js                                       │   │
│  │  • Uses mysql2/promise                                    │   │
│  │  • Connection pool for performance                        │   │
│  │  • Environment variables for credentials                  │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────┬──────────────────────────────────────┘
                            │
                            │ SQL Queries (MySQL Protocol)
                            │
┌───────────────────────────▼──────────────────────────────────────┐
│                    MySQL Database                                 │
│              (yatra_db on port 3306)                              │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Tables:                                                   │   │
│  │  • travelers                                               │   │
│  │  • vehicles                                                │   │
│  │  • itinerary                                               │   │
│  │  • posts                                                   │   │
│  │  • hotels                                                  │   │
│  │  • room_pairs                                              │   │
│  │  • ...                                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────┘
```

## 📋 Step-by-Step Connection Process

### 1. **HTML Files Load API Integration**

**Admin Panel** (`yatra-admin-frontend/index.html`):
```html
<script src="api-integration.js"></script>
```

**Website** (`yatra-frontend/index.html`):
```html
<script src="api-integration.js"></script>
```

### 2. **API Integration Detects Environment**

**File**: `api-integration.js` (in both frontend folders)

```javascript
const API_BASE = (() => {
    // Auto-detect environment
    if (window.location.hostname === 'localhost' || 
        window.location.hostname === '127.0.0.1') {
        return 'http://localhost:3000/api';  // Local development
    }
    // Production backend URL
    return 'https://yatra-production.up.railway.app/api';
})();
```

### 3. **HTML Calls API Methods**

**Example from Admin Panel**:
```javascript
// When creating a traveler
async function handleAddTraveler(event) {
    const travelerData = {
        firstName: document.getElementById('firstName').value,
        email: document.getElementById('email').value,
        // ... more fields
    };
    
    // Call API method from api-integration.js
    await api.createTraveler(travelerData);
}
```

### 4. **API Integration Makes HTTP Request**

**File**: `api-integration.js`

```javascript
async createTraveler(traveler) {
    return this.fetch('/travelers', {
        method: 'POST',
        body: JSON.stringify(traveler)
    });
}

// This becomes: POST https://yatra-production.up.railway.app/api/travelers
```

### 5. **Backend Receives Request**

**File**: `yatra-backend/server.js`

```javascript
// Route registration
app.use('/api/travelers', travelersRoutes);
```

**File**: `yatra-backend/routes/travelers.js`

```javascript
router.post('/', async (req, res) => {
    const { firstName, email, ... } = req.body;
    
    // Insert into database
    const result = await query(
        'INSERT INTO travelers (first_name, email, ...) VALUES (?, ?, ...)',
        [firstName, email, ...]
    );
    
    res.status(201).json({ id: result.insertId });
});
```

### 6. **Database Connection**

**File**: `yatra-backend/config/database.js`

```javascript
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'yatra_db',
    port: process.env.DB_PORT || 3306
});

// Query helper
async function query(sql, params = []) {
    const [results] = await pool.execute(sql, params);
    return results;
}
```

### 7. **SQL Query Executes**

The `query()` function executes:
```sql
INSERT INTO travelers (first_name, email, ...) 
VALUES (?, ?, ...)
```

## 🔑 Key Files & Their Roles

### Frontend (HTML + JavaScript)
1. **`yatra-admin-frontend/index.html`** - Admin panel UI
2. **`yatra-frontend/index.html`** - Main website UI
3. **`api-integration.js`** (in both folders) - API client library

### Backend (Node.js)
1. **`yatra-backend/server.js`** - Express server setup
2. **`yatra-backend/config/database.js`** - MySQL connection pool
3. **`yatra-backend/routes/*.js`** - API route handlers

### Database
1. **`database/schema.sql`** - Database schema
2. **MySQL Server** - Running on port 3306

## 🌐 Environment Configuration

### Local Development
```
HTML → api-integration.js → http://localhost:3000/api → Backend → MySQL (localhost:3306)
```

### Production
```
HTML → api-integration.js → https://yatra-production.up.railway.app/api → Backend → MySQL (Railway)
```

## 📝 Example: Creating a Vehicle

**1. User fills form in Admin Panel HTML**
```javascript
// In index.html
const vehicleData = {
    name: document.getElementById('vehicleName').value,
    type: document.getElementById('vehicleType').value,
    capacity: parseInt(document.getElementById('vehicleCapacity').value)
};
```

**2. Calls API method**
```javascript
await api.createVehicle(vehicleData);
```

**3. API integration sends HTTP request**
```javascript
// api-integration.js
POST https://yatra-production.up.railway.app/api/vehicles
Body: { "name": "Bus 1", "type": "Bus", "capacity": 50 }
```

**4. Backend route handles request**
```javascript
// routes/vehicles.js
router.post('/', async (req, res) => {
    const { name, type, capacity } = req.body;
    const result = await query(
        'INSERT INTO vehicles (name, type, capacity) VALUES (?, ?, ?)',
        [name, type, capacity]
    );
    res.json({ id: result.insertId });
});
```

**5. Database executes SQL**
```sql
INSERT INTO vehicles (name, type, capacity) 
VALUES ('Bus 1', 'Bus', 50);
```

**6. Response flows back**
```
Database → Backend → API Response → api-integration.js → HTML updates
```

## 🔒 Security & Authentication

- **CORS**: Backend validates origin in `server.js`
- **Environment Variables**: Database credentials stored in `.env`
- **Connection Pooling**: Prevents connection exhaustion
- **SQL Injection Protection**: Uses parameterized queries (`?` placeholders)

## 🚀 Summary

**HTML files NEVER directly connect to SQL**. They use this architecture:

1. **HTML** → JavaScript functions
2. **JavaScript** → `api-integration.js` methods
3. **api-integration.js** → HTTP requests to Backend API
4. **Backend API** → MySQL database via `mysql2` library
5. **MySQL** → Stores/retrieves data
6. **Response flows back** → HTML updates with new data

This is a **3-tier architecture**:
- **Presentation Layer**: HTML files
- **Application Layer**: Backend API
- **Data Layer**: MySQL database

