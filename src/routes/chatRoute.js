const express = require('express');
const router = express.Router();
const { TYPES } = require('tedious');

// Middleware for handling CORS
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Map to store online users
let onlineUsers = {};

// Function to set up Socket.IO connection and pass the socket to the routes
const setupSocketConnection = (io) => {
 io.of('/chat').on('connection', (socket) => {
    console.log(`User ${socket.id} connected`);

    // Socket.IO event for user joining the chat
    socket.on('user joined', (username) => {
      console.log(`User ${username} joined the chat`);
      onlineUsers[socket.id] = username;
    });

      // Broadcast the updated list of online users to all connected clients
      io.of('/chat').emit('update users', Object.values(onlineUsers));
    });

    // Socket.IO event for user disconnecting
    socket.on('disconnect', () => {
      const disconnectedUser = onlineUsers[socket.id];
      console.log(`User ${onlineUsers[socket.id]} disconnected`);
      delete onlineUsers[socket.id];
    });

      // Broadcast the updated list of online users to all connected clients
      io.of('/chat').emit('update users', Object.values(onlineUsers));
  };

module.exports = { router, setupSocketConnection };