import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();

const server = http.createServer(app);

export function getReceiverSocketId (userId) {
  return userSocketMap[userId];
}


// used to store online users
const userSocketMap = {};

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");

    const userId = socket.handshake.query.userId;
    if(userId){
        userSocketMap[userId] = socket.id;
    }

    // io.emit is used to send evant to all the connected clients
    io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    console.log("a user disconnected: ", socket.id);
    delete userSocketMap[userId];
    console.log(userSocketMap);
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };
