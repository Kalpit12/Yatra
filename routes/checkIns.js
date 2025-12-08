const express = require('express');
const router = express.Router();
const { query } = require('../config/database');

// Get all check-ins
router.get('/', async (req, res) => {
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

// Get check-ins for a specific vehicle
router.get('/vehicle/:vehicleId', async (req, res) => {
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

// Create check-in
router.post('/', async (req, res) => {
    try {
        const { vehicleId, travelerEmail, travelerId } = req.body;
        
        if (!vehicleId || !travelerEmail) {
            return res.status(400).json({ error: 'Vehicle ID and traveler email required' });
        }
        
        // Check if already checked in
        const [existing] = await query(`
            SELECT * FROM check_ins 
            WHERE vehicle_id = ? AND traveler_email = ? AND active = 1
        `, [vehicleId, travelerEmail]);
        
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
        `, [vehicleId, travelerEmail, finalTravelerId]);
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Checked in successfully' 
        });
    } catch (error) {
        console.error('Error creating check-in:', error);
        res.status(500).json({ error: 'Failed to create check-in' });
    }
});

// Check out (deactivate check-in)
router.post('/:id/checkout', async (req, res) => {
    try {
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
router.delete('/vehicle/:vehicleId', async (req, res) => {
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

