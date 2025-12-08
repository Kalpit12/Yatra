const jwt = require('jsonwebtoken');

/**
 * Authentication Middleware
 * Verifies JWT token from Authorization header
 */
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ 
            error: 'Access token required',
            message: 'Please login to access this resource'
        });
    }
    
    jwt.verify(token, process.env.JWT_SECRET || 'change-this-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ 
                error: 'Invalid or expired token',
                message: 'Your session has expired. Please login again.'
            });
        }
        req.user = user;
        next();
    });
};

/**
 * Require Admin Role
 * Must be used after authenticateToken
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (!req.user.isAdmin) {
        return res.status(403).json({ 
            error: 'Admin access required',
            message: 'This action requires administrator privileges'
        });
    }
    
    next();
};

/**
 * Optional Authentication
 * Adds user to request if token is present, but doesn't fail if missing
 */
const optionalAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET || 'change-this-secret-key', (err, user) => {
            if (!err && user) {
                req.user = user;
            }
        });
    }
    
    next();
};

module.exports = {
    authenticateToken,
    requireAdmin,
    optionalAuth
};

