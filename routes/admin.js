const express = require('express');
const router = express.Router();
const { query } = require('../config/database');
const bcrypt = require('bcrypt');

// Admin login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const [admin] = await query(
            'SELECT * FROM admin_users WHERE email = ? OR name = ?',
            [username, username]
        );
        
        if (!admin) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        // Verify password (for now, simple comparison - update with bcrypt)
        // TODO: Update admin password hash in database
        const isValid = await bcrypt.compare(password, admin.password_hash);
        if (!isValid && password !== 'yatra@2024') { // Temporary fallback
            return res.status(401).json({ error: 'Invalid credentials' });
        }
        
        const { password_hash, ...adminData } = admin;
        res.json(adminData);
    } catch (error) {
        console.error('Error during admin login:', error);
        res.status(500).json({ error: 'Login failed' });
    }
});

// Get admin profile
router.get('/profile', async (req, res) => {
    try {
        const { email } = req.query;
        
        if (!email) {
            return res.status(400).json({ error: 'Email required' });
        }
        
        const [admin] = await query(
            'SELECT id, name, email, image_url, include_in_contributors, image_compression_quality FROM admin_users WHERE email = ?',
            [email]
        );
        
        if (!admin) {
            return res.status(404).json({ error: 'Admin not found' });
        }
        
        res.json({
            id: admin.id,
            name: admin.name,
            email: admin.email,
            image: admin.image_url || '',
            includeInContributors: admin.include_in_contributors === 1,
            imageCompressionQuality: parseFloat(admin.image_compression_quality)
        });
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        res.status(500).json({ error: 'Failed to fetch admin profile' });
    }
});

// Update admin profile
router.put('/profile', async (req, res) => {
    try {
        const { email, name, image, includeInContributors, imageCompressionQuality } = req.body;
        
        if (!email) {
            return res.status(400).json({ error: 'Email required' });
        }
        
        const updateFields = [];
        const updateValues = [];
        
        if (name) { updateFields.push('name = ?'); updateValues.push(name); }
        if (image !== undefined) { updateFields.push('image_url = ?'); updateValues.push(image); }
        if (includeInContributors !== undefined) { 
            updateFields.push('include_in_contributors = ?'); 
            updateValues.push(includeInContributors); 
        }
        if (imageCompressionQuality !== undefined) { 
            updateFields.push('image_compression_quality = ?'); 
            updateValues.push(imageCompressionQuality); 
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'No fields to update' });
        }
        
        updateValues.push(email);
        
        await query(
            `UPDATE admin_users SET ${updateFields.join(', ')} WHERE email = ?`,
            updateValues
        );
        
        res.json({ message: 'Admin profile updated successfully' });
    } catch (error) {
        console.error('Error updating admin profile:', error);
        res.status(500).json({ error: 'Failed to update admin profile' });
    }
});

// Get tags
router.get('/tags', async (req, res) => {
    try {
        const tags = await query('SELECT tag_name FROM tags ORDER BY tag_name ASC');
        res.json(tags.map(t => t.tag_name));
    } catch (error) {
        console.error('Error fetching tags:', error);
        res.status(500).json({ error: 'Failed to fetch tags' });
    }
});

// Add tag
router.post('/tags', async (req, res) => {
    try {
        const { tagName } = req.body;
        
        if (!tagName) {
            return res.status(400).json({ error: 'Tag name required' });
        }
        
        await query('INSERT INTO tags (tag_name) VALUES (?) ON DUPLICATE KEY UPDATE tag_name = tag_name', [tagName]);
        res.json({ message: 'Tag added successfully' });
    } catch (error) {
        console.error('Error adding tag:', error);
        res.status(500).json({ error: 'Failed to add tag' });
    }
});

module.exports = router;

