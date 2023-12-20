const express = require('express');
const router = express.Router();
const { executeSQL } = require('../models/executesql.js');
const { TYPES } = require('tedious');

// Middleware for handling CORS
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Map to store online users
let onlineUsers = {};

// Route to check matching users
router.post('/user-favorites', async (req, res) => {
 const userFavorites = req.body;

 try {
    // SQL query to fetch online users with matching preferences
    const query = `
    SELECT DISTINCT u.UserName
    FROM Users u
    WHERE u.Juice = @juice AND u.Coffee = @coffee AND u.Sandwich = @sandwich
    AND u.UserName IN (${Object.values(onlineUsers).map((username) => `'${username}'`).join(',')});
 `;

    // Execute the SQL query
    const onlineMatchingUsers = await executeSQL(query, [
      { name: 'juice', type: TYPES.VarChar, value: userFavorites.juice },
      { name: 'coffee', type: TYPES.VarChar, value: userFavorites.coffee },
      { name: 'sandwich', type: TYPES.VarChar, value: userFavorites.sandwich },
      ...Object.values(onlineUsers).map((username) => ({ name: 'username', type: TYPES.VarChar, value: username })),
    ]);

    // Return the list of online users with matching preferences
    res.json(onlineMatchingUsers);
 } catch (error) {
    console.error('Error checking matching users:', error);
    res.status(500).json({ error: 'Internal Server Error' });
 }
});

// Function to set up Socket.IO connection and pass the socket to the routes
const setupSocketConnection = (io) => {
 io.of('/chat').on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    // Socket.IO event for user joining the chat
    socket.on('user joined', (username) => {
      console.log(`User ${username} joined the chat`);
      onlineUsers[socket.id] = username;
    });

    // Socket.IO event for user disconnecting
    socket.on('disconnect', () => {
      console.log(`User ${onlineUsers[socket.id]} disconnected`);
      delete onlineUsers[socket.id];
    });

    // Include your chatRoute and pass the socket
    //chatRoute(io, socket);
 });
};

module.exports = { router, setupSocketConnection };