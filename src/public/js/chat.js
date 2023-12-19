function getCookie(name) {
  var nameEQ = name + "=";
  console.log(document.cookie);
  var ca = document.cookie.split(";");

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function connectToSocket() {
  const socket = io();

  let username = getCookie("username");

  if (!username) {
    location.href = "/login.html"; // Change "/login" to your actual login page
  }

  socket.emit("user joined", username);

  document
    .getElementById("chat-input-container")
    .addEventListener("submit", handleFormSubmission);

  const dropdowns = [
    document.getElementById("favoritejuice-field"),
    document.getElementById("favoritecoffee-field"),
    document.getElementById("favoritesandwich-field"),
  ];

  dropdowns.forEach((dropdown) => {
    dropdown.addEventListener("change", updateMatchingFriends);
  });

  socket.on("new_message_private", addMessageToChat);
  socket.on("messages_private", addExistingMessagesToChat);
  socket.on("addChatter_private", addChatterToList);
  socket.on("removeChatter_private", removeChatterFromList);

  function handleFormSubmission(event) {
    event.preventDefault();

    const selectedFriend = document.getElementById("matchingFriendsList").dataset.selectedFriend;

    if (!selectedFriend) {
      alert("Please select a friend before starting a chat.");
      return;
    }

    const messageInput = document.getElementById("messageInput");
    const message = messageInput.value;
    const timestamp = new Date();

    if (message.trim() !== "") {
      socket.emit("new_message_private", {
        username,
        message,
        timestamp,
        recipient: selectedFriend,
      });
      messageInput.value = "";
    }
  }

  function updateMatchingFriends() {
    const selectedJuice = document.getElementById("favoritejuice-field").value;
    const selectedCoffee = document.getElementById("favoritecoffee-field").value;
    const selectedSandwich = document.getElementById("favoritesandwich-field").value;

    fetch(`/api/matching-friends?juice=${selectedJuice}&coffee=${selectedCoffee}&sandwich=${selectedSandwich}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Invalid content type. Expected JSON.");
        }

        return response.json();
      })
      .then(displayMatchingFriends)
      .catch((error) => {
        console.error("Error fetching matching friends:", error);
      });
  }

  function displayMatchingFriends(matchingFriends) {
    const matchingFriendsList = document.getElementById("matchingFriendsList");
    matchingFriendsList.innerHTML = "";

    if (matchingFriends.length > 0) {
      matchingFriends.forEach((friend) => {
        const listItem = createFriendListItem(friend.username);
        matchingFriendsList.appendChild(listItem);
      });
    } else {
      const listItem = createFriendListItem("No matching friends found.");
      matchingFriendsList.appendChild(listItem);
    }
  }

  function createFriendListItem(text) {
    const listItem = document.createElement("li");
    listItem.textContent = text;
    listItem.dataset.name = text;

    listItem.addEventListener("click", () => {
      document.getElementById("matchingFriendsList").dataset.selectedFriend = text;
    });

    return listItem;
  }

  function addMessageToChat(message) {
    const listItem = createChatMessageListItem(message);
    document.getElementById("messagesContainer").appendChild(listItem);
  }

  function addExistingMessagesToChat(messages) {
    messages.forEach(addMessageToChat);
  }

  function createChatMessageListItem(message) {
    const listItem = document.createElement("li");
    listItem.classList.add("comp-messageListItem");

    const headerItem = document.createElement("header");
    headerItem.appendChild(createSpan("name", message.username));
    headerItem.appendChild(createSpan("date", formatMessageDate(message.timestamp)));

    const paragraphItem = document.createElement("p");
    paragraphItem.innerText = message.message;

    listItem.appendChild(headerItem);
    listItem.appendChild(paragraphItem);

    return listItem;
  }

  function createSpan(className, text) {
    const span = document.createElement("span");
    span.classList.add(className);
    span.innerText = text;
    return span;
  }

  function formatMessageDate(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  }

  function addChatterToList(name) {
    const chatter = createChatterListItem(name);
    document.getElementById("chatters").appendChild(chatter);
  }

  function removeChatterFromList(name) {
    document.cookie = `userAuth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    const chatterToRemove = document.querySelector(`#chatters li[data-name="${name}"]`);
    chatterToRemove.remove();
  }

  function createChatterListItem(name) {
    const chatter = document.createElement("li");
    chatter.textContent = name;
    chatter.setAttribute("data-name", name);
    return chatter;
  }
}

document.addEventListener("DOMContentLoaded", connectToSocket);
