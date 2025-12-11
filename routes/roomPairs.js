const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all room pairs (protected - requires authentication)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const pairs = await query(`
            SELECT 
                rp.*,
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'id', t.id,
                        'name', CONCAT(t.first_name, ' ', t.last_name),
                        'email', t.email
                    )
                ) as travelers_json
            FROM room_pairs rp
            LEFT JOIN room_pair_travelers rpt ON rp.id = rpt.room_pair_id
            LEFT JOIN travelers t ON rpt.traveler_id = t.id
            GROUP BY rp.id
            ORDER BY rp.pair_no ASC
        `);
        
        const formatted = pairs.map(pair => {
            const travelers = pair.travelers_json 
                ? JSON.parse('[' + pair.travelers_json + ']')
                : [];
            
            return {
                id: pair.id,
                pairNo: pair.pair_no,
                travelerIds: travelers.map(t => t.id),
                travelers: travelers,
                createdAt: pair.created_at
            };
        });
        
        res.json(formatted);
    } catch (error) {
        console.error('Error fetching room pairs:', error);
        res.status(500).json({ error: 'Failed to fetch room pairs' });
    }
});

// Get single room pair (protected - requires authentication)
router.get('/:id', authenticateToken, async (req, res) => {
    try {
        const [pair] = await query(
            'SELECT * FROM room_pairs WHERE id = ?',
            [req.params.id]
        );
        
        if (!pair) {
            return res.status(404).json({ error: 'Room pair not found' });
        }
        
        const travelers = await query(`
            SELECT 
                t.id,
                t.first_name,
                t.last_name,
                t.email,
                t.image_url
            FROM travelers t
            INNER JOIN room_pair_travelers rpt ON t.id = rpt.traveler_id
            WHERE rpt.room_pair_id = ?
        `, [req.params.id]);
        
        res.json({
            ...pair,
            travelers
        });
    } catch (error) {
        console.error('Error fetching room pair:', error);
        res.status(500).json({ error: 'Failed to fetch room pair' });
    }
});

// Create new room pair
// Create room pair (protected - requires admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { pairNo, travelerIds } = req.body;
        
        if (!pairNo || !travelerIds || travelerIds.length === 0) {
            return res.status(400).json({ error: 'Pair number and at least one traveler required' });
        }
        
        // Insert room pair
        const result = await query(`
            INSERT INTO room_pairs (pair_no) VALUES (?)
        `, [pairNo]);
        
        const pairId = result.insertId;
        
        // Insert traveler relationships
        for (const travelerId of travelerIds) {
            await query(`
                INSERT INTO room_pair_travelers (room_pair_id, traveler_id)
                VALUES (?, ?)
            `, [pairId, travelerId]);
        }
        
        res.status(201).json({ 
            id: pairId, 
            message: 'Room pair created successfully' 
        });
    } catch (error) {
        console.error('Error creating room pair:', error);
        if (error.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Pair number already exists' });
        } else {
            res.status(500).json({ error: 'Failed to create room pair' });
        }
    }
});

// Update room pair
// Update room pair (protected - requires admin)
router.put('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { pairNo, travelerIds } = req.body;
        
        // Update pair number if provided
        if (pairNo) {
            await query(
                'UPDATE room_pairs SET pair_no = ? WHERE id = ?',
                [pairNo, req.params.id]
            );
        }
        
        // Update travelers if provided
        if (travelerIds !== undefined) {
            // Delete old relationships
            await query(
                'DELETE FROM room_pair_travelers WHERE room_pair_id = ?',
                [req.params.id]
            );
            
            // Insert new relationships
            for (const travelerId of travelerIds) {
                await query(`
                    INSERT INTO room_pair_travelers (room_pair_id, traveler_id)
                    VALUES (?, ?)
                `, [req.params.id, travelerId]);
            }
        }
        
        res.json({ message: 'Room pair updated successfully' });
    } catch (error) {
        console.error('Error updating room pair:', error);
        res.status(500).json({ error: 'Failed to update room pair' });
    }
});

// Delete room pair
// Delete room pair (protected - requires admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        await query('DELETE FROM room_pairs WHERE id = ?', [req.params.id]);
        res.json({ message: 'Room pair deleted successfully' });
    } catch (error) {
        console.error('Error deleting room pair:', error);
        res.status(500).json({ error: 'Failed to delete room pair' });
    }
});

module.exports = router;

