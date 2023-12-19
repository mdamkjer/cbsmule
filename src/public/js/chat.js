document.addEventListener("DOMContentLoaded", () => {
  // Connect to the Socket.IO server
  const socket = io();

  // Retrieve username from cookies
  let username = getCookie("userAuth");

  // Check if username is not found in cookies
  if (!username) {
  // Redirect to the login page or perform any other action
  location.href = "/public/login.html"; // Change "/login" to your actual login page
}


  // Emit the user joined event with the username
  socket.emit("user joined", username);

  // Handle form submission
  document.getElementById("chat-input-container").addEventListener("submit", function (event) {
    event.preventDefault();

    // Check if a friend is selected
    const selectedFriend = document.getElementById("matchingFriendsList").dataset.selectedFriend;

    if (!selectedFriend) {
      alert("Please select a friend before starting a chat.");
      return;
    }

    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    const timestamp = new Date();

    if (message.trim() !== "") {
      // Emit a new message event with sender, recipient, message, and timestamp
      socket.emit("new_message_private", {
        username,
        message,
        timestamp,
        recipient: selectedFriend,
      });
      messageInput.value = "";
    }
  });

  // Update matching friends when dropdowns change
  const dropdowns = [
    document.getElementById("favoritejuice-field"),
    document.getElementById("favoritecoffee-field"),
    document.getElementById("favoritesandwich-field"),
  ];

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("change", updateMatchingFriends);
  });

  // Function to fetch and display matching friends based on selected preferences
  function updateMatchingFriends() {
    const selectedJuice = document.getElementById("favoritejuice-field").value;
    const selectedCoffee = document.getElementById("favoritecoffee-field").value;
    const selectedSandwich = document.getElementById("favoritesandwich-field").value;

    // Fetch matching friends from the server
    fetch(`/api/matching-friends?juice=${selectedJuice}&coffee=${selectedCoffee}&sandwich=${selectedSandwich}`)
      .then((response) => response.json())
      .then((matchingFriends) => {
        displayMatchingFriends(matchingFriends);
      })
      .catch((error) => {
        console.error("Error fetching matching friends:", error);
      });
  }

  // Function to display matching friends in the "Matching Friends" section
  function displayMatchingFriends(matchingFriends) {
    const matchingFriendsList = document.getElementById("matchingFriendsList");
    matchingFriendsList.innerHTML = ""; // Clear previous list

    if (matchingFriends.length > 0) {
      matchingFriends.forEach((friend) => {
        const listItem = document.createElement("li");
        listItem.textContent = friend.username;
        listItem.dataset.name = friend.username;

        // Add a click event listener to select the friend
        listItem.addEventListener("click", () => {
          // Set the selected friend
          document.getElementById("matchingFriendsList").dataset.selectedFriend = friend.username;
        });

        matchingFriendsList.appendChild(listItem);
      });
    } else {
      // Display a message if no matching friends are found
      const listItem = document.createElement("li");
      listItem.textContent = "No matching friends found.";
      matchingFriendsList.appendChild(listItem);
    }
  }

  // Function to add a new message to the chat
  const addMessageToChat = (message) => {
    const listItem = document.createElement("li");
    listItem.classList.add("comp-messageListItem");

    const headerItem = document.createElement("header");
    const nameItem = document.createElement("span");
    nameItem.classList.add("name");
    nameItem.innerText = message.username;

    const dateItem = document.createElement("span");
    dateItem.classList.add("date");
    const date = new Date(message.timestamp);
    dateItem.innerText = date.toLocaleDateString();

    headerItem.append(nameItem);
    headerItem.append(dateItem);

    const paragraphItem = document.createElement("p");
    paragraphItem.innerText = message.message;

    listItem.append(headerItem);
    listItem.append(paragraphItem);

    document.getElementById("messagesContainer").appendChild(listItem);
  };

  // Socket.IO event handlers
  socket.on("new_message_private", (message) => {
    // Add new private message to the chat
    addMessageToChat(message);
  });

  socket.on("messages_private", (messages) => {
    // Add existing private messages to the chat
    messages.forEach((message) => addMessageToChat(message));
  });

  socket.on("addChatter_private", (name) => {
    // Add a new chatter to the list
    const chatter = document.createElement("li");
    chatter.textContent = name;
    chatter.setAttribute("data-name", name);
    document.getElementById("chatters").appendChild(chatter);
  });

  socket.on("removeChatter_private", (name) => {
    // Remove a chatter from the list when disconnected
    document.cookie = `userAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    const chatterToRemove = document.querySelector(
      `#chatters li[data-name="${name}"]`
    );
    chatterToRemove.remove();
  });
});

