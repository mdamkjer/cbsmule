// Add an event listener to the login form submission button
function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookie;
  }

document
  .getElementById("login-form-submit")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Get the user input from the form fields
    const username = document.getElementById("username-field").value;
    const password = document.getElementById("password-field").value;

    // Create an object to store the user data
    const userData = {
      username: username,
      password: password,
    };

    // Use the fetch API to send a POST request to the backend server with the user data
    fetch("/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          // If the login was successful, set a cookie with the user data and redirect to the chat page
          setCookie('username', username, 3)
          window.location.href = "/chat.html"; // Redirect to the chat page
        } else {
          // If the login was not successful, display an error message
          alert("Error: " + data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  });

//Event listener to create account button
document
  .getElementById("create-account-button")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Prevent the form from submitting and refreshing the page

    // Redirect the user to the user profile page
    window.location.href = "/userProfile.html";
  });
