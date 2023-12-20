// Import required modules
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const { MessagingResponse } = require("twilio").twiml;
const http = require("http");

const app = express();
//Constants for server configuration
const PORT = 2000; //ændret fra 2000 til 80
//const IP = "0.0.0.0"; not using IP

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files
app.use("/", express.static(path.join(__dirname, "public")));

// Initialize socket.io
//const server = http.createServer(app);
//const io = new Server(server);
//const http = require("http").Server(app);
//const io = require("socket.io")(http);
const server = http.createServer(app);
const io = new Server(server);

// Import your authentication module
const loginRoute = require("./routes/loginRoute.js");
const { router: chatRoute, setupSocketConnection } = require("./routes/chatRoute.js");
const userProfileRoute = require("./routes/userProfileRoute.js");

// Sample route for checking if the server is alive
app.get("/alive", async (req, res) => {
  res.status(200).send("It is alive!");
});

// Sample route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Sample route to serve the login.html file
app.get("/loginRoute", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/login.html"));
});

// Add a route for userProfile.html
app.get("/userProfile", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/userProfile.html"));
});

//Add routes for events.html NOT IN THE FRONTEND YET
app.get("/events", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/events.html"));
});

// Add the chat route to the app
//app.use('/chat', chatRoute(io));
setupSocketConnection(io);

// Mount userProfileRoute routes
app.use("/api/users", userProfileRoute);

//Routes for login
app.use("/api", loginRoute);

//Routes for chat
app.use("/chat", chatRoute);

// Sample Twilio route UPDATE THIS BUT HAVE TO INSTALL AND THEN PUT THE CODE BACK IN REPOSITORY
app.post("/events/sms", (req, res) => {
  const twiml = new MessagingResponse();
  twiml.message(
    "CBSmule har modtaget din besked. Vi vender tilbage hurtigst muligt."
  );
  res.type("text/xml").send(twiml.toString());
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
