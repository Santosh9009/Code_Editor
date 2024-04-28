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

function getRoomClients(roomId:string){
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId)=>{
    return {socketId,username:userSocketMap[socketId]}
  })
}


io.on("connection", (socket) => {

  // join
  socket.on(ACTIONS.JOIN, ({ username, roomId }: { username: string, roomId: string }) => {
    console.log(username)
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    const clients = getRoomClients(roomId);
    clients.forEach(({socketId})=>{
      io.to(socketId).emit(ACTIONS.JOINED,{
        clients,  
        username,
        socketId:socket.id
      })
    })
    console.log(userSocketMap)
  });

// disconnet
  socket.on('disconnecting',()=>{
  
    
    socket.rooms.forEach((roomId)=>{
      socket.to(roomId).emit(ACTIONS.DISCONNECTED,{
        socketId:socket.id,
        username:userSocketMap[socket.id]
      })
      socket.leave(roomId);
    })
    delete userSocketMap[socket.id]
    console.log(userSocketMap);
  })

  socket.on('disconnect',()=>{
    console.log(socket.id)
  })
  

});


const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("server is listening on port 5000");
});
