import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ACTIONS } from "./Actions";

const app = express();
const server = createServer(app);
const io = new Server(server);



type usermap = {
  [socketId: string]: string,
}
const userSocketMap: usermap = {};

function getRoomClients(roomid:string){
  return Array.from(io.sockets.adapter.rooms.get(roomid) || []).map((socketId)=>{
    return {socketId,username:userSocketMap[socketId]}
  })
}

io.on("connection", (socket) => {

  socket.on(ACTIONS.JOIN, ({ username, roomID }: { username: string, roomID: string }) => {
    console.log(username)
    userSocketMap[socket.id] = username;
    socket.join(roomID);
    const clients = getRoomClients(roomID);
    clients.forEach(({socketId})=>{
      io.to(socketId).emit(ACTIONS.JOINED,{
        clients,  
        username,
        socketId:socket.id
      })
    })
  });
   
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("server is listening on port 5000");
});
