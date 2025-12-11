const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all check-ins (admin only to avoid data leakage)
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { vehicleId, active, travelerEmail } = req.query;
        
        let sql = `
            SELECT 
                ci.*,
                t.name as traveler_name,
                t.first_name,
                t.last_name,
                v.name as vehicle_name
            FROM check_ins ci
            LEFT JOIN travelers t ON ci.traveler_id = t.id
            LEFT JOIN vehicles v ON ci.vehicle_id = v.id
            WHERE 1=1
        `;
        const params = [];
        
        if (vehicleId) {
            sql += ' AND ci.vehicle_id = ?';
            params.push(vehicleId);
        }
        if (active !== undefined) {
            sql += ' AND ci.active = ?';
            params.push(active === 'true');
        }
        if (travelerEmail) {
            sql += ' AND ci.traveler_email = ?';
            params.push(travelerEmail);
        }
        
        sql += ' ORDER BY ci.checked_in_at DESC';
        
        const checkIns = await query(sql, params);
        
        res.json(checkIns);
    } catch (error) {
        console.error('Error fetching check-ins:', error);
        res.status(500).json({ error: 'Failed to fetch check-ins' });
    }
});

// Get check-ins by vehicle (admin only to avoid data leakage)
router.get('/vehicle/:vehicleId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { active } = req.query;
        
        let sql = `
            SELECT 
                ci.*,
                t.name as traveler_name,
                t.first_name,
                t.last_name,
                t.email
            FROM check_ins ci
            LEFT JOIN travelers t ON ci.traveler_id = t.id
            WHERE ci.vehicle_id = ?
        `;
        const params = [req.params.vehicleId];
        
        if (active !== undefined) {
            sql += ' AND ci.active = ?';
            params.push(active === 'true');
        }
        
        sql += ' ORDER BY ci.checked_in_at DESC';
        
        const checkIns = await query(sql, params);
        
        // Format response
        const formatted = checkIns.map(ci => ({
            email: ci.traveler_email,
            name: ci.traveler_name || `${ci.first_name} ${ci.last_name}`,
            checkedIn: ci.active === 1,
            timestamp: ci.checked_in_at
        }));
        
        res.json({
            vehicleId: parseInt(req.params.vehicleId),
            active: active !== 'false',
            checkedIn: formatted.filter(c => c.checkedIn).map(c => c.email),
            travelers: formatted
        });
    } catch (error) {
        console.error('Error fetching vehicle check-ins:', error);
        res.status(500).json({ error: 'Failed to fetch vehicle check-ins' });
    }
});

// Create check-in (protected - travelers can only check themselves in)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { vehicleId, travelerEmail, travelerId } = req.body;
        
        if (!vehicleId || !travelerEmail) {
            return res.status(400).json({ error: 'Vehicle ID and traveler email required' });
        }
        
        // Validate vehicle ID
        const parsedVehicleId = parseInt(vehicleId);
        if (!Number.isFinite(parsedVehicleId) || parsedVehicleId <= 0) {
            return res.status(400).json({ error: 'Invalid vehicle ID' });
        }
        
        // Only allow self check-in unless admin
        if (!req.user.isAdmin && req.user.email !== travelerEmail) {
            return res.status(403).json({
                error: 'Access denied',
                message: 'You can only check in yourself'
            });
        }

        // Check if already checked in
        const [existing] = await query(`
            SELECT * FROM check_ins 
            WHERE vehicle_id = ? AND traveler_email = ? AND active = 1
        `, [parsedVehicleId, travelerEmail]);
        
        if (existing) {
            return res.status(400).json({ error: 'Already checked in' });
        }
        
        // Get traveler ID if not provided
        let finalTravelerId = travelerId;
        if (!finalTravelerId) {
            const [traveler] = await query(
                'SELECT id FROM travelers WHERE email = ?',
                [travelerEmail]
            );
            finalTravelerId = traveler ? traveler.id : null;
        }
        
        // Insert check-in
        const result = await query(`
            INSERT INTO check_ins (vehicle_id, traveler_email, traveler_id, active)
            VALUES (?, ?, ?, 1)
        `, [parsedVehicleId, travelerEmail, finalTravelerId]);
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Checked in successfully' 
        });
    } catch (error) {
        console.error('Error creating check-in:', error);
        res.status(500).json({ error: 'Failed to create check-in' });
    }
});

// Checkout (protected - only admin or owner)
router.post('/:id/checkout', authenticateToken, async (req, res) => {
    try {
        const [checkIn] = await query(
            'SELECT traveler_email FROM check_ins WHERE id = ?',
            [req.params.id]
        );

        if (!checkIn) {
            return res.status(404).json({ error: 'Check-in not found' });
        }

        if (!req.user.isAdmin && checkIn.traveler_email !== req.user.email) {
            return res.status(403).json({
                error: 'Access denied',
                message: 'You can only check out yourself'
            });
        }

        await query(`
            UPDATE check_ins 
            SET active = 0, checked_out_at = NOW()
            WHERE id = ?
        `, [req.params.id]);
        
        res.json({ message: 'Checked out successfully' });
    } catch (error) {
        console.error('Error checking out:', error);
        res.status(500).json({ error: 'Failed to check out' });
    }
});

// Clear all check-ins for a vehicle
// Clear all check-ins for vehicle (protected - requires admin)
router.delete('/vehicle/:vehicleId', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await query(`
            UPDATE check_ins 
            SET active = 0, checked_out_at = NOW()
            WHERE vehicle_id = ? AND active = 1
        `, [req.params.vehicleId]);
        
        res.json({ message: 'All check-ins cleared for vehicle' });
    } catch (error) {
        console.error('Error clearing check-ins:', error);
        res.status(500).json({ error: 'Failed to clear check-ins' });
    }
});

module.exports = router;

