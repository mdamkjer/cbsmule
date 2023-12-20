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

router.get('/user-favorites', async (req, res) => {
  try {
    // Assuming the preferences are sent in the request body
    const { username } = req.body;

    // SQL query to fetch user favorites from the database
    const query = `
    SELECT u.Juice, u.Coffee, u.Sandwich
    FROM Users u
    WHERE u.UserName = @username;
    `;

    // Execute the SQL query
    const userFavorites = await executeSQL(query, [{ name: 'username', type: TYPES.VarChar, value: username }]);

    res.json(userFavorites);
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Socket.IO event for tracking online users
const onlineUsers = {};

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

    // Socket.IO event for checking matching users
    socket.on('check_matching_users', async (preferences) => {
      const { juice, coffee, sandwich } = preferences;

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
          { name: 'juice', type: TYPES.VarChar, value: juice },
          { name: 'coffee', type: TYPES.VarChar, value: coffee },
          { name: 'sandwich', type: TYPES.VarChar, value: sandwich },
          ...Object.values(onlineUsers).map((username) => ({ name: 'username', type: TYPES.VarChar, value: username })),
        ]);

        // Emit the list of online users with matching preferences
        socket.emit('matching_users', onlineMatchingUsers);
      } catch (error) {
        console.error('Error checking matching users:', error);
      }
    });

    // // Include your chatRoute and pass the socket
    // chatRoute(io, socket);
  });
};

module.exports = { router, setupSocketConnection };
