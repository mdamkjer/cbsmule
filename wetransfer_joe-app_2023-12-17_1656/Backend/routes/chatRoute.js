const express = require('express');
const router = express.Router();
const { Server } = require('socket.io');

// Create a Socket.IO server
const io = new Server();

// This object will store the chat messages
const messages = [];

// Socket.IO middleware to handle connections
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('join_private', (username) => {
    console.log(`${username} joined the chat`);
    socket.username = username;

    // Emit the existing messages to the newly connected user
    socket.emit('messages_private', messages);

    // Broadcast that a new chatter joined
    io.emit('addChatter_private', username);
  });

  socket.on('new_message_private', (message) => {
    console.log(`New message from ${socket.username}: ${message}`);

    const newMessage = {
      username: socket.username,
      message,
      timestamp: new Date(),
    };

    // Add the new message to the array
    messages.push(newMessage);

    // Broadcast the new message to all connected clients
    io.emit('new_message_private', newMessage);
  });

  socket.on('disconnect', () => {
    console.log(`${socket.username} disconnected`);
    
    // Broadcast that a chatter left
    io.emit('removeChatter_private', socket.username);
  });
});

// Attach the Socket.IO server to the Express app
router.io = io;

module.exports = router;
