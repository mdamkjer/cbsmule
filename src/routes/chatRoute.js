module.exports = (io) => {
  const connectedUsers = new Map();
  const chatMessages = []; // Array to store chat messages

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join_private", (username) => {
      console.log(`${username} joined the chat`);
      connectedUsers.set(socket.id, username);
      io.emit("addChatter_private", username);
    });

    socket.on("new_message_private", (message) => {
      console.log(`${message.username}: ${message.message}`);
      chatMessages.push(message); // Store the new message in the array

      // Emit the message to everyone except the sender
      socket.broadcast.emit("new_message_private", message);
    });

    socket.on("disconnect", () => {
      const username = connectedUsers.get(socket.id);

      if (username) {
        console.log(`${username} disconnected`);
        connectedUsers.delete(socket.id);
        io.emit("removeChatter_private", username);
      }
    });

    socket.on("fetchMessages_private", (username) => {
      // Fetch messages for the specific user
      const userMessages = chatMessages.filter(
        (message) => message.username === username
      );

      // Send messages to the user
      io.to(socket.id).emit("messages_private", userMessages);
    });
  });
};
