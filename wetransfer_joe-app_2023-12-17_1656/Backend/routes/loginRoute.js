const express = require('express');
const router = express.Router();
const { executeSQL } = require('../db/executesql.js');
const cors = require('cors');
const { TYPES } = require('tedious');
const bcrypt = require('bcrypt');

router.use(cors());

router.get('/alive', async (req, res) => {
  res.send('Hello from users!');
});

// Check login
router.post('/login', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let query = `SELECT * FROM dbo.Users WHERE UserName = @username`;

  try {
    // Retrieve user data from the database
    const userParams = [{ name: 'username', type: TYPES.VarChar, value: username }];
    const response = await executeSQL(query, userParams);
    const user = response[0];

    if (user) {
      // Compare the provided password with the hashed password from the database
      const passwordMatch = await bcrypt.compare(password, user.Password);

      if (passwordMatch) {
        // Set a session cookie (assuming setCookie function is available)
        setCookie(res, 'userId', user.UserID);
        res.status(200).send({
          UserID: user.UserID,
          Username: user.UserName,
          Email: user.Email,
          PhoneNumber: user.PhoneNumber,
          FavoriteJuice: user.FavoriteJuice,
          FavoriteCoffee: user.FavoriteCoffee,
          FavoriteSandwich: user.FavoriteSandwich,
        });
      } else {
        res.status(401).send("Invalid credentials");
      }
    } else {
      res.status(404).send("User not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Create user
router.post('/update', async (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let email = req.body.email;
  let phoneNumber = req.body.phoneNumber;
  let juice = req.body.juice;
  let coffee = req.body.coffee;
  let sandwich = req.body.sandwich;

  try {
    // Check if the username or email is already taken
    const checkUserQuery = `SELECT * FROM dbo.Users WHERE UserName = @username OR Email = @email`;
    const userExists = await executeSQL(checkUserQuery, [
      { name: 'username', type: TYPES.VarChar, value: username },
      { name: 'email', type: TYPES.VarChar, value: email },
    ]);

    if (userExists.length > 0) {
      return res.status(400).json({ error: 'Username or email is already taken.' });
    }

    // Hash password before storing it
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user data into dbo.Users
    let userQuery = `INSERT INTO dbo.Users (UserName, Password, Email, PhoneNumber, Juice, Coffee, Sandwich) 
      VALUES (@username, @password, @email, @phoneNumber, @juice, @coffee, @sandwich);`;

    const userParams = [
      { name: 'username', type: TYPES.VarChar, value: username },
      { name: 'password', type: TYPES.VarChar, value: hashedPassword },
      { name: 'email', type: TYPES.VarChar, value: email },
      { name: 'phoneNumber', type: TYPES.VarChar, value: phoneNumber },
      { name: 'juice', type: TYPES.VarChar, value: juice },
      { name: 'coffee', type: TYPES.VarChar, value: coffee },
      { name: 'sandwich', type: TYPES.VarChar, value: sandwich },
    ];

    // Execute the user insertion query
    await executeSQL(userQuery, userParams);

    // Set a session cookie (assuming setCookie function is available)
    setCookie(res, 'userId', user.UserID);

    res.status(201).send({
      Username: username,
      Email: email,
      PhoneNumber: phoneNumber,
      juice: juice,
      coffee: coffee,
      sandwich: sandwich,
    });

  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send(error.message);
  }
});

// Function to set a cookie
function setCookie(res, name, value) {
  res.cookie(name, value, { httpOnly: true });
}

module.exports = router;
