import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ACTIONS } from "./Actions";
import axios from 'axios';
import { getVersion } from "./Getlang";

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

// code_change
  socket.on(ACTIONS.CODE_CHANGE,({roomId,code}:{roomId:string,code:string})=>{
    socket.broadcast.to(roomId).emit(ACTIONS.CODE_CHANGE,{code})
  })
  

  // code_sync
  socket.on(ACTIONS.SYNC_CODE,({code,socketId}:{code:string,socketId:string})=>{
    io.to(socketId).emit(ACTIONS.CODE_CHANGE,{code})
  })

  // code_run
  socket.on(ACTIONS.RUN_CODE, async ({ lang, code, roomId }: { lang: string, code: string, roomId: string }) => {

    const version = await getVersion(lang);
    try {
        const response = await axios.post("https://emkc.org/api/v2/piston/execute", {
            language: lang,
            version: version,
            files: [{ content: code }]
        });

        const stdout = response.data.run.stdout;
        let stderr = response.data.run.stderr;
        let actualError = null;

        // Check if stderr is undefined or null
        if (stderr === undefined || stderr === null) {
            actualError = stderr;
        } else {
            // Remove 'piston' from stderr
            stderr = stderr.replace(/piston/g, '');
        }

        console.log(stdout, stderr);

        // Emit the output to the room
        io.to(roomId).emit(ACTIONS.CODE_OUTPUT, { stdout, error: stderr });
    } catch (error) {
        console.error("Error executing code")
        // Emit an error message to the room
        io.to(roomId).emit(ACTIONS.CODE_OUTPUT, { error: "Error executing code" });
    }
})



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
    console.log(socket.id,"disconnected")
  })
  

});


const port = process.env.PORT || 5000;

server.listen(port, () => {
  console.log("server is listening on port 5000");
});
