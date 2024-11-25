import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { ACTIONS } from "./Actions";
import axios from 'axios';
import { getVersion } from "./Getlang";
require('dotenv').config();

const API_URL = process.env.EXECUTION_URL;


const app = express();
const server = createServer(app);
const io = new Server(server);

interface Client {
  socketId: string;
  username: string;
}

interface UserMap {
  [socketId: string]: string;
}
// Use a Map for user-to-socket mapping and code storage
const userSocketMap = new Map<string, string>();
const roomCodeMap = new Map<string, string>(); 


// Utility to get clients in a room
function getRoomClients(roomId: string): Client[] {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map((socketId) => ({
    socketId,
    username: userSocketMap.get(socketId) || "Anonymous", 
  }));
}



io.on("connection", (socket) => {

  // join
  socket.on(ACTIONS.JOIN, ({ username, roomId }: { username: string, roomId: string }) => {
    // console.log(username)
    userSocketMap.set(socket.id, username);
    socket.join(roomId);
    const clients = getRoomClients(roomId);
    clients.forEach(({socketId})=>{
      io.to(socketId).emit(ACTIONS.JOINED,{
        clients,  
        username,
        socketId:socket.id
      })
    })
    const currentCode = roomCodeMap.get(roomId); 
    socket.emit(ACTIONS.CODE_CHANGE, { code: currentCode }); 

    console.log(userSocketMap)
  });

// code_change
  socket.on(ACTIONS.CODE_CHANGE,({roomId,code}:{roomId:string,code:string})=>{
    roomCodeMap.set(roomId, code);
    console.log("Room current code"+roomCodeMap.get(roomId))
    socket.broadcast.to(roomId).emit(ACTIONS.CODE_CHANGE,{code})
  })
  

  // code_sync
  // socket.on(ACTIONS.SYNC_CODE,({code,socketId}:{code:string,socketId:string})=>{
  //   io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
  // })

  // code_run
//   socket.on(ACTIONS.RUN_CODE, async ({ lang, code, roomId }: { lang: string, code: string, roomId: string }) => {

//     const version = await getVersion(lang);
//     try {
//       console.log('inside try')

//       console.log("Payload sent to API:", {
//         language: lang,
//         version: version,
//         files: [{ content: code }],
//     });

//         const response = await axios.post(API_URL || '', {
//             language: lang,
//             version: version,
//             files: [{ content: code }]
//         });
//         console.log('code is : '+code)
//         console.log("response is : "+response)

//         const stdout = response.data.run.stdout;
//         let stderr = response.data.run.stderr;
//         let actualError = null;

//         // Check if stderr is undefined or null
//         if (stderr === undefined || stderr === null) {
//             actualError = stderr;
//         } else {
//             // Remove 'piston' from stderr
//             stderr = stderr.replace(/piston/g, '');
//         }

//         console.log(stdout, stderr);

//         // Emit the output to the room
//         io.to(roomId).emit(ACTIONS.CODE_OUTPUT, { stdout, error: stderr });
//     } catch (error:any) {
//         // console.error("Error executing code")
//         console.error("Error executing code:",  error.response.data || error.message || error);
//         // Emit an error message to the room
//         io.to(roomId).emit(ACTIONS.CODE_OUTPUT, { error: "Error executing code" });
//     }
// })


socket.on(ACTIONS.RUN_CODE, async ({ lang, code, roomId }: { lang: string, code: string, roomId: string }) => {
  try {
      // Log the received request
      console.log("Received RUN_CODE event:", { lang, code });

      // Send code execution request to the external service
      const response = await axios.post(API_URL || '', {
          language: lang,
          code,
      });

      const { stdout, stderr } = response.data;
      console.log("Code Execution Response:", { stdout, stderr });

      // Emit the response back to the room
      io.to(roomId).emit(ACTIONS.CODE_OUTPUT, { stdout, error: stderr });
  } catch (error: any) {
      console.error("Error executing code:", error.message);
      io.to(roomId).emit(ACTIONS.CODE_OUTPUT, { error: "Error executing code" });
  }
});


// language_change
  socket.on(ACTIONS.LANG_CHANGE,({lang_object,roomId}:{lang_object:{},roomId:string})=>{
    socket.broadcast.to(roomId).emit(ACTIONS.LANG_CHANGE,{lang_object})
  })


// disconnet
  socket.on('disconnecting',()=>{
  
    
    socket.rooms.forEach((roomId)=>{
      const username = userSocketMap.get(socket.id);
      socket.to(roomId).emit(ACTIONS.DISCONNECTED,{
        socketId:socket.id,
        username
      })
      socket.leave(roomId);
    })
    userSocketMap.delete(socket.id);
    console.log(userSocketMap);
  })

  socket.on('disconnect',()=>{
    console.log(socket.id,"disconnected")
  })
  

});


const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("server is listening on port 3000");
});
