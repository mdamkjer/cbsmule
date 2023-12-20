function getCookie(name) {
  var nameEQ = name + "=";
  console.log(document.cookie)
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
  const socket = io("/chat"); //updated with "/chat"

  // Retrieve username from cookies
  let username = getCookie("username");

  // Check if username is not found in cookies
  if (!username) {
    // Redirect to the login page or perform any other action
    location.href = "/login.html"; // Change "/login" to your actual login page
    return;
  }

  // Emit the user joined event with the username
  socket.emit("user joined", username);

  // Fetch users with similar preferences from the server
  fetch("/chat/user-favorites", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((matchingUsers) => {
      // Display matching users in the dropdown
      displayMatchingUsersDropdown(matchingUsers);
    })
    .catch((error) => {
      console.error("Error fetching matching users:", error);
    });

  // Function to display matching users in the dropdown
  function displayMatchingUsersDropdown(matchingUsers) {
    const dropdownContainer = document.getElementsByClassName("matchingUsersList");
    const dropdown = document.createElement("select");
    dropdown.setAttribute("class", "matchingUsersList");

    // Add an option for each matching user
    matchingUsers.forEach((user) => {
      const option = document.createElement("option");
      option.value = user.username; // Replace with the appropriate user property
      option.text = user.username; // Replace with the appropriate user property
      dropdown.add(option);
    });

    // Clear previous dropdown and append the new one
    dropdownContainer.innerHTML = "";
    dropdownContainer.appendChild(dropdown);

    // Add event listener to the dropdown for initiating a chat
    dropdown.addEventListener("change", () => {
      const selectedFriend = dropdown.value;
      // TODO: Implement logic to initiate a chat with the selected user
      console.log(`Initiate chat with user: ${selectedFriend}`);
    });
  }

  // Handle form submission
  document.getElementById("chat-input-container").addEventListener("submit", function (event) {
    event.preventDefault();

    // Check if a friend is selected
    const selectedFriend = document.getElementsByClassName("matchingUsersList").value;

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
});
