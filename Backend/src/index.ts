import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { ACTIONS } from "./Actions";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const API_URL = process.env.EXECUTION_URL;

const app = express();
const server = createServer(app);
const io = new Server(server);

// Data Structures
interface User {
  username: string;
  canExecute: boolean;
}

interface Room {
  admin: string; // Admin's socketId
  users: { [socketId: string]: User };
}

const rooms: { [roomId: string]: Room } = {};

// Utility Functions
function getRoomUsers(roomId: string) {
  const room = rooms[roomId];
  if (!room) return [];
  return Object.entries(room.users).map(([socketId, user]) => ({
    socketId,
    ...user,
  }));
}

// Function to check and generate a unique username in the room
function getUniqueUsername(roomId: string, desiredUsername: string): string {
  const room = rooms[roomId];
  if (!room) return desiredUsername;  // If room doesn't exist, return as is
  
  const existingUsernames = Object.values(room.users).map(user => user.username);
  
  let uniqueUsername = desiredUsername;
  let counter = 1;

  // Check if username already exists, and if so, add a suffix
  while (existingUsernames.includes(uniqueUsername)) {
    uniqueUsername = `${desiredUsername}_${counter}`;
    counter++;
  }

  return uniqueUsername;
}

// Server Logic
io.on("connection", (socket: Socket) => {
  console.log(`New connection: ${socket.id}`);

  // Join Room
  socket.on(ACTIONS.JOIN, ({ username, roomId }: { username: string; roomId: string }) => {
    if (!rooms[roomId]) {
      // Create room and assign admin
      rooms[roomId] = {
        admin: socket.id,
        users: { [socket.id]: { username, canExecute: true } },
      };
      socket.emit(ACTIONS.SET_ADMIN, { isAdmin: true });
    } else {
      // Generate a unique username if needed
      let uniqueUsername = getUniqueUsername(roomId, username);
      rooms[roomId].users[socket.id] = { username: uniqueUsername, canExecute: false };
    }

    socket.join(roomId);
    io.to(roomId).emit(ACTIONS.JOINED, {
      users: getRoomUsers(roomId),
      admin: rooms[roomId].admin,
      username: rooms[roomId].users[socket.id].username
    });

    console.log(`User ${username} joined room ${roomId} with unique username ${rooms[roomId].users[socket.id].username}`);
  });

  // Update Permission (Admin Only)
  socket.on(ACTIONS.UPDATE_PERMISSION, ({ roomId, targetId, canExecute }: { roomId: string; targetId: string; canExecute: boolean }) => {
    const room = rooms[roomId];
    if (!room || room.admin !== socket.id) {
      socket.emit(ACTIONS.ERROR, { message: "Only admin can update permissions." });
      return;
    }

    if (room.users[targetId]) {
      room.users[targetId].canExecute = canExecute;
      io.to(roomId).emit(ACTIONS.PERMISSION_UPDATED, {
        users: getRoomUsers(roomId),
      });
    } else {
      socket.emit(ACTIONS.ERROR, { message: "User not found in room." });
    }
  });

  // Code Execution
  socket.on(ACTIONS.RUN_CODE, async ({ lang, code, roomId }: { lang: string; code: string; roomId: string }) => {
    const room = rooms[roomId];
    if (!room || !room.users[socket.id]?.canExecute) {
      socket.emit(ACTIONS.ERROR, { message: "You do not have permission to execute code." });
      return;
    }

    try {
      const response = await axios.post(API_URL || "", {
        language: lang,
        code,
      });

      const { stdout, stderr } = response.data;
      io.to(roomId).emit(ACTIONS.CODE_OUTPUT, { stdout, error: stderr });
    } catch (error: any) {
      console.error("Code Execution Error:", error.message);
      io.to(roomId).emit(ACTIONS.CODE_OUTPUT, { error: "Error executing code." });
    }
  });

  // Code Change
  socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }: { roomId: string; code: string }) => {
    socket.broadcast.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });
  });

  // Disconnect
  socket.on("disconnecting", () => {
    const roomsToLeave = Array.from(socket.rooms);
    roomsToLeave.forEach((roomId) => {
      if (rooms[roomId]) {
        const room = rooms[roomId];
        const username = room.users[socket.id]?.username;
        delete room.users[socket.id];
  
        // If admin disconnects, assign a new admin
        if (room.admin === socket.id) {
          const remainingUsers = Object.keys(room.users);
          if (remainingUsers.length > 0) {
            const newAdminSocketId = remainingUsers[0];
            room.admin = newAdminSocketId;
            room.users[newAdminSocketId].canExecute = true; // Grant execute permission to the new admin
            io.to(newAdminSocketId).emit(ACTIONS.SET_ADMIN, { isAdmin: true });
          } else {
            // No users left in the room, delete the room
            delete rooms[roomId];
          }
        }
  
        io.to(roomId).emit(ACTIONS.USER_LEFT, {
          users: getRoomUsers(roomId),
        });
        console.log(`User ${username} left room ${roomId}`);
      }
    });
  });
  

  socket.on("disconnect", () => {
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Start Server
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
