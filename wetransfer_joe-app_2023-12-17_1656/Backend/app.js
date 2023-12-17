// Import required modules
const express = require('express');
const app = express();
const port = 2000;
const cors = require('cors');
const path = require('path');
const { MessagingResponse } = require('twilio').twiml;
const http = require('http').createServer(app);
const io = require('./routes/chatRoute.js').io;

// Import your authentication module
const loginRoute = require('./routes/loginRoute.js');
const chatRoute = require('./routes/chatRoute.js');
const friendsRoute = require('./routes/friendsRoute.js');

//* Middlewares
app.use(cors());
app.use('/', express.static('Frontend'));
app.use(express.json());

// Sample route for checking if the server is alive
app.get('/alive', async (req, res) => {
  res.status(200).send('It is alive!');
});

// Sample route to serve the index.html file
app.get('/html/index.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/html/index.html'));
});

// Add a route for userProfile.html
app.get('/html/userProfile.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/html/userProfile.html'));
});


// Add routes for login and signup
app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/html/login.html'));
});

// Add the chat route to the app
app.get('/chat.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/html/chat.html'));
});
// Add the friends route to the app
app.get('/friends.html', (req, res) => {
  res.sendFile(path.join(__dirname, '/html/friends.html'))
});



// Sample Twilio route
app.post('/events/sms', (req, res) => {
  const twiml = new MessagingResponse();
  twiml.message('CBSmule har modtaget din besked. Vi vender tilbage hurtigst muligt.');
  res.type('text/xml').send(twiml.toString());
});


// Start the server
const PORT = process.env.PORT || 2000;
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
