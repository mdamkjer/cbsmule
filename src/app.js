// Import required modules
const express = require("express");
const cors = require("cors");
const path = require("path");
const { Server } = require("socket.io");
const { MessagingResponse } = require("twilio").twiml;

const app = express();
//Constants for server configuration
const port = process.env.PORT || 2000;
const host = "www.cbsmule.live";

// Middlewares
app.use(cors());
app.use(express.json());

// Serve static files
app.use("/", express.static(path.join(__dirname, "public")));

// Initialize socket.io
const server = http.createServer(app);
const io = new Server(server);

// Import your authentication module
const loginRoute = require("./routes/loginRoute.js");
const chatRoute = require("./routes/chatRoute.js");
const userProfileRoute = require("./routes/userProfileRoute.js");

// Sample route for checking if the server is alive
app.get("/alive", async (req, res) => {
  res.status(200).send("It is alive!");
});

// Sample route to serve the index.html file
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

// Add a route for userProfile.html
app.get("/userProfile", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/userProfile.html"));
});

// Add routes for login and signup
app.use(loginRoute);

// Add the chat route to the app
app.use('/chat', chatRoute(io));
chatRoute(io);

// Mount userProfileRoute routes
app.use("/api/users", userProfileRoute);

// Sample Twilio route
app.post("/events/sms", (req, res) => {
  const twiml = new MessagingResponse();
  twiml.message(
    "CBSmule har modtaget din besked. Vi vender tilbage hurtigst muligt."
  );
  res.type("text/xml").send(twiml.toString());
});

// Start the server
server.listen(port, host, () => {
  console.log(`Server is running at https://${host}:${PORT}/`);
});