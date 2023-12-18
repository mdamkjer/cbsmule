const form = document.getElementById('user-profile-form');
  const saveButton = document.getElementById('profile-form-submit');
  const deleteUserButton = document.getElementById('delete-user-button');
  const createUserButton = document.getElementById('create-user-button');

  // Function to set a cookie
  function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookie;
  }

  // Function to update user data
  function updateUserData() {
    const username = document.getElementById('username-signup-field').value;
    const password = document.getElementById('password-signup-field').value;
    const email = document.getElementById('email-signup-field').value;
    const phoneNumber = document.getElementById('phonenumber-field').value;
    const juice = document.getElementById('favoritejuice-field').value;
    const coffee = document.getElementById('favoritecoffee-field').value;
    const sandwich = document.getElementById('favoritesandwich-field').value;

    // Send a request to the server to update user data
    fetch('/api/users/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        phoneNumber,
        password,
        juice,
        coffee,
        sandwich,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        if (data && data.UserID) {
          // Update successful
          console.log('Update successful');

          // Set a cookie for the user
          setCookie('user_id', data.UserID, 7); // Adjust the cookie expiration as needed
        } else {
          // Update failed
          console.log('Update failed');
        }
      })
      .catch((error) => console.error('Error:', error));

    // Redirect to index page after saving
    location.href = '/project/src/public/index.html';
  }

  // Function to delete user
  function deleteUser() {
    // ... handle delete user logic

    // Send a request to the server to delete the user
    fetch('/api/users/delete', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        // Include any necessary data for user deletion
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        if (data && data.success) {
          // Deletion successful
          console.log('Deletion successful');

          // Remove the user_id cookie upon deletion
          document.cookie = 'user_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        } else {
          // Deletion failed
          console.log('Deletion failed');
        }
      })
      .catch((error) => console.error('Error:', error));
  }

  // Function to create user
  function createUser() {
    const username = document.getElementById('username-signup-field').value;
    const password = document.getElementById('password-signup-field').value;
    const email = document.getElementById('email-signup-field').value;
    const phoneNumber = document.getElementById('phonenumber-field').value;
    const juice = document.getElementById('favoritejuice-field').value;
    const coffee = document.getElementById('favoritecoffee-field').value;
    const sandwich = document.getElementById('favoritesandwich-field').value;

    // Send a request to the server to create a new user
    fetch('/api/users/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        phoneNumber,
        password,
        juice,
        coffee,
        sandwich,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        if (data && data.UserID) {
          // Creation successful
          console.log('User creation successful');

          // Set a cookie for the new user
          setCookie('user_id', data.UserID, 7); // Adjust the cookie expiration as needed
        } else {
          // Creation failed
          console.log('User creation failed');
        }
      })
      .catch((error) => console.error('Error:', error));

    // Redirect to index page after user creation
    location.href = '/project/src/public/index.html';
  }

  // Add event listeners
  saveButton.addEventListener('click', updateUserData);
  deleteUserButton.addEventListener('click', deleteUser);
  createUserButton.addEventListener('click', createUser);