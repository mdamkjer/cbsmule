if (typeof window !== "undefined") {
  window.addEventListener("DOMContentLoaded", (event) => {
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-form-submit');
    const createUserButton = document.getElementById('login-form-CreateUser');

    // Function to set a cookie
    function setCookie(name, value, days) {
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + days);
      const cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
      document.cookie = cookie;
    }

    loginButton.addEventListener('click', (event) => {
      event.preventDefault();

      const username = loginForm.username.value;
      const password = loginForm.password.value;

      // Send a request to the server to validate the login credentials
      fetch("/api/users/login", {
        method: "POST",
        body: JSON.stringify({
          username: username,
          password: password
        }),
        headers: {
          "Content-Type": "application/json; charset=UTF-8"
        },
      })
        .then(response => {
          if(response.ok) {
            alert('You have successfully logged in.');
                response.json().then(user => {
                    User.setLoggedInUser(user);
                    location.href = "../html/index.html";
                        });
            
                      } else {
          alert('Invalid username and/or password');
          console.error('error');
            };

    createUserButton.addEventListener('click', (event) => {
        event.preventDefault();
        location.href = "../html/userProfile.html";
    });
  });
});
});
};
