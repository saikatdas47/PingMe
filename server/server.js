import express from "express";
import "dotenv/config";
import cors from "cors";
import http from "http";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoute.js";
import { messageRouter } from "./routes/messageRoute.js";
import { Server } from "socket.io";

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);

await connectDB();



//initialize Socket.io server
export const io = new Server(server, {
  cors: { origin: "*" }
});
//store online users
export const userSocketMap = {};
// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    userSocketMap[userId] = socket.id;
  }

  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});


app.use(express.json({ limit: "4mb" }));
app.use(cors());


//Router
app.get("/api/status", (req, res) => {
  res.send("Server is Alive");
});
app.use("/api/auth", userRouter);
app.use("/api/messages", messageRouter);


server.listen(PORT, () => {
  console.log("Server is running on port:", PORT);
});