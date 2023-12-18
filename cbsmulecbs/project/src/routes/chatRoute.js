const express = require('express');
const router = express.Router();
const http = require('http').Server(express);
const io = require('socket.io')(http);

// Serve the chat.html file when the '/chat' route is accessed
router.get('/chat', (req, res) => {
    res.sendFile(__dirname + '/chat.html');
});

// Keep track of connected users
const connectedUsers = new Set();

// Socket.IO connection event
io.on('connection', (socket) => {
    console.log('A user connected');

    // Event when a user joins the chat
    socket.on('join_private', (username) => {
        console.log(`${username} joined the chat`);
        connectedUsers.add(username);
        io.emit('addChatter_private', username);
    });

    // Event when a user sends a new private message
    socket.on('new_message_private', (message) => {
        console.log(`${message.username}: ${message.message}`);
        io.emit('new_message_private', message);
    });

    // Event when a user disconnects from the chat
    socket.on('disconnect', () => {
        const username = Array.from(connectedUsers).find(user => io.sockets.sockets.get(user).id === socket.id);
        if (username) {
            console.log(`${username} disconnected`);
            connectedUsers.delete(username);
            io.emit('removeChatter_private', username);
        }
    });

    // Event to fetch and send messages to a user
    socket.on('fetchMessages_private', (username) => {
        // Fetch messages from the server or any other storage
        const messages = [
            { username: 'John', message: 'Hello, how are you?', timestamp: Date.now() - 300000 },
            { username: 'Alice', message: 'I\'m good, thank you!', timestamp: Date.now() - 200000 },
            { username: 'Bob', message: 'What about you?', timestamp: Date.now() - 100000 }
        ];

        // Send messages to the user
        io.to(socket.id).emit('messages_private', messages);
    });
});

module.exports = router;
