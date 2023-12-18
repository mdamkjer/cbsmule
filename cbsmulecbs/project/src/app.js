// Import required modules
const express = require('express');
const app = express();
const port = 2000;
const cors = require('cors');
const path = require('path');
const { MessagingResponse } = require('twilio').twiml;
const http = require('http').createServer(app);
const io = require('/project/src/routes/chatRoute.js').io;

// Import your authentication module
const loginRoute = require('/project/src/routes/loginRoute.js');
const chatRoute = require('/project/src/routes/chatRoute.js');
const friendsRoute = require('/project/src/routes/friendsRoute.js');
const userProfileRoute = require('/project/src/routes/userProfileRoute.js');

// Middlewares
app.use(cors());
app.use('/', express.static('public'));
app.use(express.json());

// Sample route for checking if the server is alive
app.get('/alive', async (req, res) => {
  res.status(200).send('It is alive!');
});

// Sample route to serve the index.html file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/project/src/public/index.html'));
});

// Add a route for userProfile.html
app.get('/userProfile', (req, res) => {
  res.sendFile(path.join(__dirname, '/project/src/public/userProfile.html'));
});

// Add routes for login and signup
app.use('/login', loginRoute);

// Add the chat route to the app
app.use('/chat', chatRoute);

// Sample Twilio route
app.post('/events/sms', (req, res) => {
  const twiml = new MessagingResponse();
  twiml.message('CBSmule har modtaget din besked. Vi vender tilbage hurtigst muligt.');
  res.type('text/xml').send(twiml.toString());
});

app.use("/friends", friendsRoute);

// Add the user profile route to the app
app.use('/userProfile', userProfileRoute);

// Start the server
const PORT = process.env.PORT || 2000;
http.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
