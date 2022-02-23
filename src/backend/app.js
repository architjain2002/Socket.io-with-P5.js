const express = require("express");
const { createServer } = require("http");
// const { Server } = require("socket.io");

const app = express();
const server = createServer(app);

const io = require("socket.io")(server, { cors: { origin: "*" } });
io.on("connection", (socket) => {
  console.log("new connection" + socket.id);
});

server.listen(5500, () => {
  console.log(`Server running at http://localhost:5500/`);
});
