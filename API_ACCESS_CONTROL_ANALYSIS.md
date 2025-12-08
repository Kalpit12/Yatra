# 🔒 API Access Control Analysis

## Current Status: ⚠️ **NO ACCESS CONTROL**

### Summary
**The APIs are currently NOT access controlled.** All endpoints are publicly accessible without authentication.

## What Exists

### ✅ Admin Login Endpoint
- **Route**: `POST /api/admin/login`
- **Location**: `yatra-backend/routes/admin.js`
- **Functionality**: 
  - Validates username/password
  - Uses bcrypt for password hashing
  - Returns admin data on success
  - **BUT**: Does NOT generate JWT tokens
  - **BUT**: Does NOT protect other routes

### ✅ CORS Configuration
- **Location**: `yatra-backend/server.js`
- **Purpose**: Controls which origins can make requests
- **Current Setting**: Allows all origins (`*`)
- **Note**: CORS is NOT access control - it only prevents browser-based attacks

### ✅ Dependencies Installed
- `jsonwebtoken` - Installed but **NOT USED**
- `bcrypt` - Used for password hashing in admin login

## What's Missing

### ❌ No Authentication Middleware
- No JWT token generation after login
- No token validation middleware
- No protected routes

### ❌ All Routes Are Public
These endpoints are **completely open** (no authentication required):

**Travelers API:**
- `GET /api/travelers` - Anyone can view all travelers
- `POST /api/travelers` - Anyone can create travelers
- `PUT /api/travelers/:id` - Anyone can update any traveler
- `DELETE /api/travelers/:id` - Anyone can delete any traveler

**Vehicles API:**
- `GET /api/vehicles` - Public
- `POST /api/vehicles` - Public (anyone can create vehicles)
- `PUT /api/vehicles/:id` - Public (anyone can modify vehicles)
- `DELETE /api/vehicles/:id` - Public (anyone can delete vehicles)

**Itinerary API:**
- `GET /api/itinerary` - Public
- `POST /api/itinerary` - Public
- `PUT /api/itinerary/:id` - Public
- `DELETE /api/itinerary/:id` - Public

**Posts API:**
- `GET /api/posts` - Public
- `POST /api/posts` - Public
- `PUT /api/posts/:id` - Public
- `DELETE /api/posts/:id` - Public

**Hotels API:**
- All endpoints are public

**Settings API:**
- All endpoints are public

## Security Risks

### 🚨 Critical Issues

1. **Anyone can modify data**
   - No authentication required for CREATE, UPDATE, DELETE operations
   - Anyone with the API URL can manipulate data

2. **Sensitive data exposure**
   - Traveler personal information (emails, phone numbers) is publicly accessible
   - No authorization checks

3. **No rate limiting**
   - APIs can be abused/spammed
   - No protection against DDoS

4. **Admin routes unprotected**
   - Admin profile endpoints don't verify admin status
   - Anyone can query admin information

## Recommended Implementation

### 1. Add JWT Authentication

**Create middleware** (`yatra-backend/middleware/auth.js`):
```javascript
const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
};

const requireAdmin = (req, res, next) => {
    if (!req.user || !req.user.isAdmin) {
        return res.status(403).json({ error: 'Admin access required' });
    }
    next();
};

module.exports = { authenticateToken, requireAdmin };
```

### 2. Update Admin Login to Generate Tokens

**Modify** `yatra-backend/routes/admin.js`:
```javascript
const jwt = require('jsonwebtoken');

router.post('/login', async (req, res) => {
    // ... existing validation ...
    
    // Generate JWT token
    const token = jwt.sign(
        { 
            id: admin.id, 
            email: admin.email, 
            isAdmin: true 
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    
    res.json({
        token,
        admin: adminData
    });
});
```

### 3. Protect Routes

**Example for vehicles** (`yatra-backend/routes/vehicles.js`):
```javascript
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Public routes
router.get('/', async (req, res) => { ... });

// Protected routes - require authentication
router.post('/', authenticateToken, requireAdmin, async (req, res) => { ... });
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => { ... });
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => { ... });
```

### 4. Update Frontend to Send Tokens

**Modify** `api-integration.js`:
```javascript
// Store token after login
let authToken = localStorage.getItem('authToken');

// Add to all requests
async fetch(endpoint, options = {}) {
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    // Add auth token if available
    if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
    }
    
    const response = await fetch(url, {
        ...options,
        headers
    });
    
    // Handle 401 (unauthorized) - redirect to login
    if (response.status === 401) {
        localStorage.removeItem('authToken');
        window.location.href = '/login';
        throw new Error('Session expired');
    }
    
    // ... rest of code
}
```

## Access Control Strategy

### Public Endpoints (No Auth Required)
- `GET /api/posts` (approved posts only)
- `GET /api/itinerary`
- `GET /api/vehicles` (read-only)
- `POST /api/travelers/login` (traveler login)
- `POST /api/admin/login` (admin login)

### Protected Endpoints (Require Auth)
- All `POST`, `PUT`, `DELETE` operations
- `GET /api/travelers` (sensitive data)
- `GET /api/admin/profile`
- All settings modifications

### Admin-Only Endpoints (Require Admin Role)
- Vehicle management (create/update/delete)
- Itinerary management
- Hotel management
- Room pair management
- Post approval
- Settings management

## Current State vs Recommended

| Feature | Current | Recommended |
|---------|---------|------------|
| Authentication | ❌ None | ✅ JWT Tokens |
| Route Protection | ❌ None | ✅ Middleware |
| Admin Verification | ❌ None | ✅ Role-based |
| Token Storage | ❌ None | ✅ localStorage |
| Token Expiry | ❌ N/A | ✅ 24 hours |
| Password Hashing | ✅ bcrypt | ✅ bcrypt (keep) |

## Immediate Actions Needed

1. **Implement JWT authentication** - Generate tokens on login
2. **Add authentication middleware** - Protect routes
3. **Add role-based access control** - Separate admin/user permissions
4. **Update frontend** - Send tokens in requests
5. **Add rate limiting** - Prevent abuse
6. **Add input validation** - Sanitize all inputs

## Conclusion

**Current Status**: APIs are completely open and unprotected. Anyone with the API URL can:
- View all data
- Create/modify/delete records
- Access sensitive information

**Priority**: **HIGH** - This is a critical security issue that should be addressed before production deployment.

