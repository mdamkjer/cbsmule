window.addEventListener("DOMContentLoaded", (event) =>{
  const profileForm = document.getElementById('profile-form');
  const submitButton = document.getElementById('profile-form-submit');
  const goToLogInButton = document.getElementById('profile-form-gotologin');
  const newUserButtons = document.getElementById('new-user-buttons'); 
  const deleteUserButton = document.getElementById('delete-user-button');
  const updateUserButton = document.getElementById('update-user');
  const favoriteJuice = document.getElementById('favoritejuice-field')
  const favoriteCoffee = document.getElementById('favoritecoffee-field')
  const favoriteSandwich = document.getElementById('favoritesandwich-field')
  const loggedInUser = User.getUser();

  // Function to set a cookie
  function setCookie(name, value, days) {
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + days);
    const cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
    document.cookie = cookie;
  }

  saveButton.addEventListener("click", function (event) {
    event.preventDefault();

    const username = document.getElementById("username-signup-field").value;
    const password = document.getElementById("password-signup-field").value;
    const email = document.getElementById("email-signup-field").value;
    const phoneNumber = document.getElementById("phonenumber-field").value;
    const juice = document.getElementById("favoritejuice-field").value;
    const coffee = document.getElementById("favoritecoffee-field").value;
    const sandwich = document.getElementById("favoritesandwich-field").value;

    // Send a request to the server to update user data
    fetch("/api/users/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
          console.log("Update successful");

          // Set a cookie for the user
          setCookie("user_id", data.UserID, 7); // Adjust the cookie expiration as needed
        } else {
          // Update failed
          console.log("Update failed");
        }
      })
      .catch((error) => console.error("Error:", error));

    // Redirect to index page after saving
    location.href = "/Frontend/html/index.html";
  });

   //tjekker på om, der er en bruger logget ind
   if (loggedInUser === null) {
    //skjuler knapper, der ikke skal bruges, når det er en ny bruger
    deleteUserButton.style.opacity = 0;
    updateUserButton.style.opacity = 0;

} else {
    //skjuler knapper, der ikke skal bruges, når det er en eksisterende bruger
    newUserButtons.style.opacity = 0;

    //username kan ikke ændres
    profileForm.username.readOnly = true;
    //inputfelderne indeholder brugeren der er logget inds informationer
    profileForm.username.value = loggedInUser.Username;
    profileForm.password.value = loggedInUser.Password;
    profileForm.name.value = loggedInUser.Name;
    profileForm.email.value = loggedInUser.Email;
    profileForm.address.value = loggedInUser.Address;
    favoriteJuice.favoritejuice.value = loggedInUser.Juice;
    favoriteCoffee.favoritecoffee.value = loggedInUser.Coffee;
    favoriteSandwich.favoritesandwich.value = loggedInUser.Sandwich;
}

//opret bruger kanppen
submitButton.addEventListener('click', (event) => {
    event.preventDefault();

    const username = profileForm.username.value;
    const password = profileForm.password.value;
    const name = profileForm.name.value;
    const email = profileForm.email.value;
    const address = profileForm.address.value;
    const favoriteJuice = favoriteJuice.favoritejuice.value;
    const favoriteCoffee = favoriteCoffee.favoritecoffee.value;
    const favoriteSandwich = favoriteSandwich.favoritesandwich.value;

    const userExists = User.getUser(username);

    //tjekker at brugernavnet ikke allerede eksisterer
    if (userExists !== null) {
        alert('Username already exists.');
    }
    //hvis alle felter ikke er udfyldt vises alert 
    else if (password === '' || name === '' || email === '' || address === '' || favoriteJuice === '' || favoriteCoffee === '' || favoriteSandwich === '') {
        alert('All fields must be filled');
    } else {
        //Anvender metode fra user, der opretter eller opdaterer bruger
        User.createUser(username, password, name, email, address, favoriteJuice, favoriteCoffee, favoriteSandwich);
        alert('Your user has been created. You can now log in');
        location.href = "../html/login.html";
    }
});

//knap, der opdaterer en bruger
updateUserButton.addEventListener('click', (event) => {
    event.preventDefault();

    const password = profileForm.password.value;
    const name = profileForm.name.value;
    const email = profileForm.email.value;
    const address = profileForm.address.value;
    const juice = favoriteJuice.juice.value;
    const coffee = favoriteCoffee.coffee.value;
    const sandwich = favoriteSandwich.sandwich.value;

    const existingUser = User.getUser();

    //hvis alle felter ikke er udfyldt vises beskeden
    if (password === '' || name === '' || email === '' || address === '' || juice === '' || coffee === '' || sandwich === '') {
        alert('All fields must be filled')
    } else {
        User.updateUser(existingUser.Id, existingUser.Username, password, name, email, address, favoriteJuice, favoriteCoffee, favoriteSandwich);
       
    }
});

goToLogInButton.addEventListener('click', (event) => { 
    event.preventDefault();
    location.href = "Frontend/html/login.html";
});

//knap, der sletter en bruger
deleteUserButton.addEventListener('click', (event) => {
    event.preventDefault();
    const user = User.getUser();
    if(user != undefined ) {
        User.deleteUser(user.Id);
    }
});
});
