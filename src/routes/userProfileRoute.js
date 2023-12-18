const express = require('express');
const router = express.Router();
const { executeSQL } = require('../models/executesql.js');
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
            INSERT INTO Users (Username, Password, Email, PhoneNumber, Juice, Coffee, Sandwich)
            VALUES (@username, @password, @email, @phoneNumber, @juice, @coffee, @sandwich);
        `;

        // SQL parameters
        const params = [
            { name: 'Username', type: 'VarChar', value: username },
            { name: 'Password', type: 'VarChar', value: hashedPassword },
            { name: 'Email', type: 'VarChar', value: email },
            { name: 'PhoneNumber', type: 'VarChar', value: phoneNumber },
            { name: 'Juice', type: 'VarChar', value: juice },
            { name: 'Coffee', type: 'VarChar', value: coffee },
            { name: 'Sandwich', type: 'VarChar', value: sandwich }
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
            SET Password = @password, Email = @email, PhoneNumber = @phoneNumber,
                Juice = @juice, Coffee = @coffee, Sandwich = @sandwich
            WHERE Username = @username;
        `;

        // SQL parameters
        const params = [
            { name: 'Username', type: 'VarChar', value: username },
            { name: 'Password', type: 'VarChar', value: hashedPassword },
            { name: 'Email', type: 'VarChar', value: email },
            { name: 'PhoneNumber', type: 'VarChar', value: phoneNumber },
            { name: 'Juice', type: 'VarChar', value: juice },
            { name: 'Coffee', type: 'VarChar', value: coffee },
            { name: 'Sandwich', type: 'VarChar', value: sandwich }
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
            DELETE FROM Users
            WHERE UserID = @userId;
        `;

        // SQL parameters
        const params = [
            { name: 'UserID', type: 'Int', value: userId }
        ];

        // Execute the SQL query
        await executeSQL(query, params);

        // Clear the cookie
        res.clearCookie('UserID');

        res.status(200).json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

module.exports = router;
