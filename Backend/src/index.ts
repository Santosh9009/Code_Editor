import express from "express";
import { createServer } from "node:http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Hello from server",
  });
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("message", (msg) => {
    io.emit("message" , msg);
    // socket.broadcast.emit("message",msg)
    console.log(msg)
  });
});

server.listen(5000, () => {
  console.log("server is listening on port 5000");
});
