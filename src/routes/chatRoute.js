module.exports = (io) => {
  const coffeeLovers = new Set();
  const juiceLovers = new Set();
  const sandwichLovers = new Set();

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("join_chat", (username) => {
      console.log(`${username} joined the chat`);
      socket.username = username;
    });

    socket.on("send_message", (data) => {
      console.log(`${data.username}: ${data.message}`);
      io.emit("receive_message", { username: data.username, message: data.message });
    });

    socket.on("leave_chat", (username) => {
      console.log(`${username} left the chat`);
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
