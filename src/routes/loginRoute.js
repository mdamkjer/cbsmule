const express = require("express");
const router = express.Router();
const { executeSQL } = require("../models/executesql.js");
const bcrypt = require("bcrypt");

// Middleware for handling CORS
router.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Route for user login
router.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // SQL query to fetch user data by username
    const query = `
            SELECT Username, Password
            FROM Users
            WHERE Username = @username;
        `;

    // SQL parameters
    const params = [{ name: "Username", type: "VarChar", value: username }];

    // Execute the SQL query
    const result = await executeSQL(query, params);

    // Check if the user exists
    if (result.length > 0) {
      const storedPassword = result[0].Password;

      // Compare the provided password with the hashed password from the database
      const isPasswordValid = await bcrypt.compare(password, storedPassword);

      if (isPasswordValid) {
        // Set a cookie with the username
        res.cookie("Username", username, {
          expires: new Date(Date.now() + 31536000000),
          httpOnly: true,
        });

        res.status(200).json({ success: true, message: "Login successful" });
      } else {
        res
          .status(401)
          .json({ success: false, message: "Invalid username or password" });
      }
    } else {
      res
        .status(401)
        .json({ success: false, message: "Invalid username or password" });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

module.exports = router;
