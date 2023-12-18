const express = require('express');
const router = express.Router();
const { executeSQL } = require('../db/executesql.js');
const bcrypt = require('bcrypt');

// Middleware for handling CORS
router.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Route to create a new user
router.post('/create', async (req, res) => {
    try {
        const { username, password, email, phoneNumber, juice, coffee, sandwich } = req.body;

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // SQL query to insert a new user
        const query = `
            INSERT INTO users (username, password, email, phoneNumber, juice, coffee, sandwich)
            VALUES (@username, @password, @email, @phoneNumber, @juice, @coffee, @sandwich);
        `;

        // SQL parameters
        const params = [
            { name: 'username', type: 'VarChar', value: username },
            { name: 'password', type: 'VarChar', value: hashedPassword },
            { name: 'email', type: 'VarChar', value: email },
            { name: 'phoneNumber', type: 'VarChar', value: phoneNumber },
            { name: 'juice', type: 'VarChar', value: juice },
            { name: 'coffee', type: 'VarChar', value: coffee },
            { name: 'sandwich', type: 'VarChar', value: sandwich }
        ];

        // Execute the SQL query
        await executeSQL(query, params);

        res.status(201).json({ success: true, message: 'User created successfully' });
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Route to update user data
router.post('/update', async (req, res) => {
    try {
        const { username, password, email, phoneNumber, juice, coffee, sandwich } = req.body;

        // Hash the password before updating it in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // SQL query to update user data
        const query = `
            UPDATE users
            SET password = @password, email = @email, phoneNumber = @phoneNumber,
                juice = @juice, coffee = @coffee, sandwich = @sandwich
            WHERE username = @username;
        `;

        // SQL parameters
        const params = [
            { name: 'username', type: 'VarChar', value: username },
            { name: 'password', type: 'VarChar', value: hashedPassword },
            { name: 'email', type: 'VarChar', value: email },
            { name: 'phoneNumber', type: 'VarChar', value: phoneNumber },
            { name: 'juice', type: 'VarChar', value: juice },
            { name: 'coffee', type: 'VarChar', value: coffee },
            { name: 'sandwich', type: 'VarChar', value: sandwich }
        ];

        // Execute the SQL query
        await executeSQL(query, params);

        res.status(200).json({ success: true, message: 'User updated successfully' });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Route to delete user
router.delete('/delete', async (req, res) => {
    try {
        const { userId } = req.body; // Assuming you pass user ID in the request body

        if (!userId) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }

        // SQL query to delete user
        const query = `
            DELETE FROM users
            WHERE user_id = @userId;
        `;

        // SQL parameters
        const params = [
            { name: 'userId', type: 'Int', value: userId }
        ];

        // Execute the SQL query
        await executeSQL(query, params);

        // Clear the cookie
        res.clearCookie('user_id');

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
