const express = require("express");
const app = express();
const http = require("http").createServer(app);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// Socket

const users = {};
const io = require("socket.io")(http);

io.on("connection", (socket) => {
  console.log("Connected ...");

  socket.on("new-user-joined", (name) => {
    console.log("New user joined", name);
    users[socket.id] = name;
    socket.broadcast.emit("user-joined", name);
    console.log(users);
  });

  socket.on("message", (msg) => {
    socket.broadcast.emit("message", msg);
  });

  socket.on("disconnect", (msg) => {
    socket.broadcast.emit("left", users[socket.id]);
    delete users[socket.id];
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("typing", data);
  });
});
