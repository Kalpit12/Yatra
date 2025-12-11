const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

// Get all hotels (protected read)
router.get('/', authenticateToken, async (req, res) => {
    try {
        const hotels = await query('SELECT * FROM hotels ORDER BY name ASC');
        res.json(hotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        res.status(500).json({ error: 'Failed to fetch hotels' });
    }
});

// Get room allotments (protected - requires authentication)
router.get('/allotments', authenticateToken, async (req, res) => {
    try {
        const { hotelId, date, travelerId } = req.query;
        
        let sql = `
            SELECT 
                ra.*,
                h.name as hotel_name,
                t.first_name,
                t.last_name,
                t.email
            FROM room_allotments ra
            LEFT JOIN hotels h ON ra.hotel_id = h.id
            LEFT JOIN travelers t ON ra.traveler_id = t.id
            WHERE 1=1
        `;
        const params = [];
        
        if (hotelId) {
            sql += ' AND ra.hotel_id = ?';
            params.push(hotelId);
        }
        if (date) {
            sql += ' AND ra.date = ?';
            params.push(date);
        }
        if (travelerId) {
            sql += ' AND ra.traveler_id = ?';
            params.push(travelerId);
        }
        
        sql += ' ORDER BY ra.date, ra.hotel_id, ra.floor, ra.room';
        
        const allotments = await query(sql, params);
        res.json(allotments);
    } catch (error) {
        console.error('Error fetching room allotments:', error);
        res.status(500).json({ error: 'Failed to fetch room allotments' });
    }
});

// Create hotel
// Create new hotel (protected - requires admin)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { 
            name, address, city, state, country, lat, lng, phone, email,
            total_floors, total_rooms, check_in_date, check_out_date, notes
        } = req.body;
        
        // Helper functions to convert undefined to null or empty string
        const toNull = (value) => (value === undefined || value === '' ? null : value);
        const toEmptyString = (value) => (value === undefined || value === null ? '' : String(value));
        
        // Ensure name is provided (required field)
        if (!name) {
            return res.status(400).json({ error: 'Hotel name is required' });
        }
        
        // Convert values, ensuring undefined becomes null for nullable fields
        const finalName = toEmptyString(name);
        const finalAddress = toNull(address);
        const finalCity = toNull(city);
        const finalState = toNull(state);
        const finalCountry = toNull(country);
        const finalLat = toNull(lat ? parseFloat(lat) : null);
        const finalLng = toNull(lng ? parseFloat(lng) : null);
        const finalPhone = toNull(phone);
        const finalEmail = toNull(email);
        const finalTotalFloors = toNull(total_floors ? parseInt(total_floors) : null);
        const finalTotalRooms = toNull(total_rooms ? parseInt(total_rooms) : null);
        const finalCheckInDate = toNull(check_in_date);
        const finalCheckOutDate = toNull(check_out_date);
        const finalNotes = toNull(notes);
        
        const result = await query(`
            INSERT INTO hotels (name, address, city, state, country, lat, lng, phone, email, 
                               total_floors, total_rooms, check_in_date, check_out_date, notes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            finalName, finalAddress, finalCity, finalState, finalCountry, 
            finalLat, finalLng, finalPhone, finalEmail,
            finalTotalFloors, finalTotalRooms, finalCheckInDate, finalCheckOutDate, finalNotes
        ]);
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Hotel created successfully' 
        });
    } catch (error) {
        console.error('Error creating hotel:', error);
        res.status(500).json({ error: 'Failed to create hotel', details: error.message });
    }
});

// Create room allotment (protected - requires admin)
router.post('/allotments', authenticateToken, requireAdmin, async (req, res) => {
    try {
        console.log('📥 POST /hotels/allotments - Received request body:', JSON.stringify(req.body, null, 2));
        
        const { hotelId, travelerId, date, floor, room, pairNo } = req.body;
        
        // Helper function to convert undefined to null
        const toNull = (value) => (value === undefined || value === '' ? null : value);
        const toEmptyString = (value) => (value === undefined || value === null ? '' : String(value));
        
        // Validate required fields
        if (!hotelId || !travelerId || !date) {
            console.error('❌ Missing required fields - hotelId:', hotelId, 'travelerId:', travelerId, 'date:', date);
            return res.status(400).json({ error: 'hotelId, travelerId, and date are required' });
        }
        
        // Convert values, ensuring undefined becomes null
        const finalHotelId = parseInt(hotelId);
        const finalTravelerId = parseInt(travelerId);
        const finalDate = toEmptyString(date);
        const finalFloor = toNull(floor);
        const finalRoom = toNull(room);
        const finalPairNo = toNull(pairNo ? parseInt(pairNo) : null);
        
        console.log('📋 Processed values:', {
            hotelId: finalHotelId,
            travelerId: finalTravelerId,
            date: finalDate,
            floor: finalFloor,
            room: finalRoom,
            pairNo: finalPairNo
        });
        
        if (isNaN(finalHotelId) || isNaN(finalTravelerId)) {
            console.error('❌ Invalid IDs - hotelId:', finalHotelId, 'travelerId:', finalTravelerId);
            return res.status(400).json({ error: 'hotelId and travelerId must be valid numbers' });
        }
        
        const sql = `INSERT INTO room_allotments (hotel_id, traveler_id, date, floor, room, pair_no) VALUES (?, ?, ?, ?, ?, ?)`;
        const params = [finalHotelId, finalTravelerId, finalDate, finalFloor, finalRoom, finalPairNo];
        
        console.log('💾 Executing SQL:', sql);
        console.log('📦 Parameters:', params);
        
        const result = await query(sql, params);
        
        console.log('✅ Room allotment created successfully, ID:', result.insertId);
        
        res.status(201).json({ 
            id: result.insertId, 
            message: 'Room allotment created successfully' 
        });
    } catch (error) {
        console.error('❌ Error creating room allotment:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to create room allotment', details: error.message });
    }
});

// Update room allotment
// Update room allotment (protected - requires admin)
router.put('/allotments/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { floor, room, pairNo } = req.body;
        const allotmentId = parseInt(req.params.id);
        
        if (isNaN(allotmentId)) {
            return res.status(400).json({ error: 'Invalid allotment ID' });
        }
        
        const toNull = (value) => (value === undefined || value === '' ? null : value);
        
        const updateFields = [];
        const updateValues = [];
        
        if (floor !== undefined) {
            updateFields.push('floor = ?');
            updateValues.push(toNull(floor));
        }
        if (room !== undefined) {
            updateFields.push('room = ?');
            updateValues.push(toNull(room));
        }
        if (pairNo !== undefined) {
            updateFields.push('pair_no = ?');
            updateValues.push(toNull(pairNo ? parseInt(pairNo) : null));
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        updateValues.push(allotmentId);
        
        await query(
            `UPDATE room_allotments SET ${updateFields.join(', ')} WHERE id = ?`,
            updateValues
        );
        
        res.json({ message: 'Room allotment updated successfully' });
    } catch (error) {
        console.error('Error updating room allotment:', error);
        res.status(500).json({ error: 'Failed to update room allotment', details: error.message });
    }
});

// Delete room allotment
// Delete room allotment (protected - requires admin)
router.delete('/allotments/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const allotmentId = parseInt(req.params.id);
        
        if (isNaN(allotmentId)) {
            return res.status(400).json({ error: 'Invalid allotment ID' });
        }
        
        await query('DELETE FROM room_allotments WHERE id = ?', [allotmentId]);
        
        res.json({ message: 'Room allotment deleted successfully' });
    } catch (error) {
        console.error('Error deleting room allotment:', error);
        res.status(500).json({ error: 'Failed to delete room allotment', details: error.message });
    }
});

// Delete all room allotments for a hotel and date
// NOTE: This route must come BEFORE router.delete('/:id') to avoid route conflicts
// Delete room allotments by hotel/date (protected - requires admin)
router.delete('/allotments', authenticateToken, requireAdmin, async (req, res) => {
    try {
        console.log('🗑️ DELETE /hotels/allotments - Path:', req.path, 'Original URL:', req.originalUrl);
        console.log('🗑️ Query params:', req.query);
        
        const { hotelId, date } = req.query;
        
        if (!hotelId || !date) {
            console.error('❌ Missing query params - hotelId:', hotelId, 'date:', date);
            return res.status(400).json({ error: 'hotelId and date are required as query parameters' });
        }
        
        const finalHotelId = parseInt(hotelId);
        if (isNaN(finalHotelId)) {
            console.error('❌ Invalid hotelId:', hotelId);
            return res.status(400).json({ error: 'hotelId must be a valid number' });
        }
        
        console.log(`🗑️ Deleting room allotments for hotel ${finalHotelId} on date ${date}`);
        
        const result = await query(
            'DELETE FROM room_allotments WHERE hotel_id = ? AND date = ?',
            [finalHotelId, date]
        );
        
        console.log(`✅ Deleted ${result.affectedRows} room allotment(s)`);
        
        res.json({ 
            message: 'Room allotments deleted successfully',
            deletedCount: result.affectedRows
        });
    } catch (error) {
        console.error('❌ Error deleting room allotments:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ error: 'Failed to delete room allotments', details: error.message });
    }
});

// Delete hotel
// NOTE: This route must come AFTER /allotments routes to avoid conflicts
// Delete hotel (protected - requires admin)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        console.log('🗑️ DELETE /hotels/:id - Path:', req.path, 'Original URL:', req.originalUrl, 'Params:', req.params, 'Query:', req.query);
        
        // Skip if this is an allotments route (should be handled by /allotments route)
        // Check both path and params.id to catch route mismatches
        if (req.path === '/allotments' || req.path.includes('allotments') || req.params.id === 'allotments') {
            console.log('⚠️ Allotments route detected in /:id handler - redirecting to correct route');
            console.log('⚠️ This suggests a route ordering issue. The /allotments route should match first.');
            return res.status(404).json({ error: 'Route not found - use /hotels/allotments endpoint' });
        }
        
        const hotelId = parseInt(req.params.id);
        
        if (isNaN(hotelId)) {
            console.error('❌ Invalid hotel ID in params:', req.params.id);
            console.error('❌ This might be an allotments route that was incorrectly matched to /:id');
            return res.status(400).json({ error: 'Invalid hotel ID' });
        }
        
        // First, check if hotel exists
        const [hotel] = await query('SELECT id FROM hotels WHERE id = ?', [hotelId]);
        
        if (!hotel) {
            return res.status(404).json({ error: 'Hotel not found' });
        }
        
        // Delete related room allotments first (if any)
        // Note: If there are foreign key constraints with CASCADE, this might not be needed
        // But it's safer to delete them explicitly
        await query('DELETE FROM room_allotments WHERE hotel_id = ?', [hotelId]);
        
        // Delete the hotel
        await query('DELETE FROM hotels WHERE id = ?', [hotelId]);
        
        res.json({ message: 'Hotel deleted successfully' });
    } catch (error) {
        console.error('Error deleting hotel:', error);
        res.status(500).json({ error: 'Failed to delete hotel', details: error.message });
    }
});

module.exports = router;

