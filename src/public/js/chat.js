// Function to get a cookie by name
function getCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

document.addEventListener("DOMContentLoaded", () => {
  // Connect to the Socket.IO server
  const socket = io("https://www.cbsmule.live");

  // Retrieve username from cookies
  let username = getCookie("username");

  // Check if username is not found in cookies
  if (!username) {
    // Redirect to the login page or perform any other action
    location.href = "/login.html";
    return;
  }

  // Emit the user joined event with the username
  socket.emit("user joined", username);

  // Socket.IO event for updating the list of online users
  socket.on("update users", (users) => {
    // Update the UI with the list of online users
    updateOnlineUsers(users);
  });
  
  // Handle form submission
  document.getElementById("chat-input-container").addEventListener("submit", function (event) {
    event.preventDefault();
    liveChat(); // Call the liveChat function
  });

  // Function to send a chat message
  function liveChat() {
    // Get the message from the input field
    const messageInput = document.getElementById("input");
    const message = messageInput.value.trim();

    // Check if the message is not empty
    if (message !== "") {
      // Create the full message with username
      const fullMessage = `${username}: ${message}`;

      // Emit a new chat message event to the server
      socket.emit("chat message", fullMessage);

      // Clear the input field
      messageInput.value = "";
    }
  }

  // Socket.IO event for receiving chat messages
  socket.on("chat message", (msg) => {
    // Get the element where messages will be displayed
    const messageContainer = document.getElementById("messageInput");

    // Create a new list item for the message
    const newList = document.createElement("li");
    newList.textContent = msg;

    // Append the message to the container
    messageContainer.appendChild(newList);

    // Scroll to the bottom of the container
    window.scrollTo(0, document.body.scrollHeight);
  });
  // Update the UI with the list of online users
  function updateOnlineUsers(users) {
    const onlineUsersContainer = document.getElementById("chatters");
    onlineUsersContainer.innerHTML = ""; // Clear previous list

    users.forEach((user) => {
      const userItem = document.createElement("li");
      userItem.textContent = user;
      onlineUsersContainer.appendChild(userItem);
    });
  }
});
