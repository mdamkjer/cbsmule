const express = require('express');
const router = express.Router();
const { executeSQL } = require('../models/executesql.js');
const bcrypt = require('bcrypt');
const { TYPES } = require('tedious');

// Middleware for handling CORS
router.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

router.post('/user-favorites', async (req, res) => {
  try {
     // Assuming the preferences are sent in the request body
     const { username } = req.body;
 
     // SQL query to fetch user favorites from the database
     const query = `
       SELECT uf.juice, uf.coffee, uf.sandwich
       FROM UserFavorites uf
       INNER JOIN Users u ON uf.UserID = u.UserID
       WHERE u.UserName = @username;
     `;
 
     // Execute the SQL query
     const userFavorites = await executeSQL(query, [{ name: 'username', type: 'VarChar', value: username }]);
 
     res.json(userFavorites);
  } catch (error) {
     console.error('Error fetching user favorites:', error);
     res.status(500).json({ error: 'Internal Server Error' });
  }
 });
 
 // ...
 
 // Socket.IO event for checking matching users
 socket.on('check_matching_users', async (preferences) => {
  const { juice, coffee, sandwich } = preferences;
 
  try {
     // SQL query to fetch online users with matching preferences
     const query = `
       SELECT DISTINCT u.UserName
       FROM Users u
       INNER JOIN UserFavorites uf ON u.UserID = uf.UserID
       WHERE uf.juice = @juice AND uf.coffee = @coffee AND uf.sandwich = @sandwich
       AND u.UserName IN (${Object.values(onlineUsers).map((username) => `'${username}'`).join(',')});
     `;
 
     // Execute the SQL query
     const onlineMatchingUsers = await executeSQL(query, [
       { name: 'juice', type: 'VarChar', value: juice },
       { name: 'coffee', type: 'VarChar', value: coffee },
       { name: 'sandwich', type: 'VarChar', value: sandwich },
       ...Object.values(onlineUsers).map((username) => ({ name: 'username', type: 'VarChar', value: username })),
     ]);
 
     // Emit the list of online users with matching preferences
     socket.emit('matching_users', onlineMatchingUsers);
  } catch (error) {
     console.error('Error checking matching users:', error);
  }
 });