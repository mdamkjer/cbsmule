document.addEventListener('DOMContentLoaded', () => {
    // Connect to the Socket.IO server on port 2000
    const socket = io.connect();

    // Retrieve username from cookies or prompt for it
    let username = Cookies.get('username');
    if (!username) {
      username = prompt('Please enter your username:');
      Cookies.set('username', username);
    }

    // Emit the join_private event with the username
    socket.emit('join_private', username);

    // Handle form submission
    document.getElementById('chatForm').addEventListener('submit', function (event) {
      event.preventDefault();

      const messageInput = document.getElementById('message');
      const message = messageInput.value;

      if (message.trim() !== '') {
        socket.emit('new_message_private', { username, message });
        messageInput.value = '';
      }
    });

    // Function to add a new message to the chat
    const addMessageToChat = (message) => {
      const listItem = document.createElement('li');
      listItem.classList.add('comp-messageListItem');

      const headerItem = document.createElement('header');
      const nameItem = document.createElement('span');
      nameItem.classList.add('name');
      nameItem.innerText = message.username;

      const dateItem = document.createElement('span');
      dateItem.classList.add('date');
      const date = new Date(message.timestamp);
      dateItem.innerText = date.toLocaleDateString();

      headerItem.append(nameItem);
      headerItem.append(dateItem);

      const paragraphItem = document.createElement('p');
      paragraphItem.innerText = message.message;

      listItem.append(headerItem);
      listItem.append(paragraphItem);

      document.getElementById('messagesContainer').appendChild(listItem);
    };

    // Socket.IO event handlers
    socket.on('new_message_private', (message) => {
      addMessageToChat(message);
    });

    socket.on('messages_private', (messages) => {
      messages.forEach((message) => addMessageToChat(message));
    });

    socket.on('addChatter_private', (name) => {
      const chatter = document.createElement('li');
      chatter.textContent = name;
      chatter.setAttribute('data-name', name);
      document.getElementById('chatters').appendChild(chatter);
    });

    socket.on('removeChatter_private', (name) => {
      // Update cookies when a chatter is removed
      Cookies.remove('username');
      const chatterToRemove = document.querySelector(`#chatters li[data-name="${name}"]`);
      chatterToRemove.remove();
    });

    // Fetch friends from the server and populate the dropdown
    fetch('/api/friends') // Replace '/api/friends' with your actual API endpoint
      .then(response => response.json())
      .then((friends) => {
        const dropdown = document.getElementById('friendsDropdown');

        friends.forEach((friend) => {
          const option = document.createElement('option');
          option.value = friend.username;
          option.text = friend.username;
          dropdown.appendChild(option);
        });
      })
      .catch((error) => {
        console.error('Error fetching friends:', error);
      });
  });