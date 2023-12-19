function getCookie(name) {
  var nameEQ = name + "=";
  console.log(document.cookie);
  var ca = document.cookie.split(";");

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}
document.addEventListener("DOMContentLoaded", () => {
  const socket = io();

  const username = getCookie("username");

  if (!username) {
    location.href = "/login.html";
  }

  socket.emit("join_chat", username);

  const chatForm = document.getElementById("chat-form");
  const messageInput = document.getElementById("message-input");
  const messagesList = document.getElementById("messages");

  chatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const message = messageInput.value.trim();
    if (message !== "") {
      socket.emit("send_message", { username, message });
      messageInput.value = "";
    }
  });

  socket.on("receive_message", (data) => {
    const listItem = document.createElement("li");
    listItem.textContent = `${data.username}: ${data.message}`;
    messagesList.appendChild(listItem);
  });

  window.addEventListener("beforeunload", () => {
    socket.emit("leave_chat", username);
  });
});
