import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import { v4 as uuid } from "uuid";
import { errorMiddleware } from "./middlewares/error.js";
import adminRoute from "./routes/admin.js";
import chatRoute from "./routes/chat.js";
import userRoute from "./routes/user.js";
import { connectDB } from "./utils/features.js";

import cors from "cors";
// import { socket } from "server/router.js";
import { Server } from "socket.io";
import { corsOptions } from "./constants/config.js";
import { CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, NEW_MESSAGE_ALERT, ONLINE_USERS, START_TYPING, STOP_TYPING } from "./constants/events.js";
import { getSockets } from "./lib/helper.js";
import { socketAuthenticator } from "./middlewares/auth.js";
import { Message } from "./models/message.js";

dotenv.config({
  path: "./.env",
});

const mongoURL = process.env.MONGO_URI;
const port = process.env.PORT || 3000;
const envMode = process.env.NODE_ENV.trim() || "PRODUCTION";
const adminSecretKey = process.env.ADMIN_SECRET_KEY;

const userSocketIds = new Map();
const onlineUsers = new Set()

connectDB(mongoURL);

// createUser(10)

// createSingleChat(10)
// createGroupChat(10)

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const app = express();

const server = createServer(app);
const io = new Server(server, { cors: corsOptions });

app.set("io", io)

app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOptions))

app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/admin", adminRoute);


io.use((socket, next) => {
  cookieParser()(
    socket.request,
    socket.request.res,
    async (err) => await socketAuthenticator(err, socket, next)
  )
})

io.on("connection", (socket) => {
  console.log("user connected", socket.id);

  const user = socket.user;

  userSocketIds.set(user._id.toString(), socket.id);

  // console.log("userSocketIds", userSocketIds);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };

    console.log("real time messages", members)

    const membersSocket = getSockets(members);
    io.to(membersSocket).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });

    io.to(membersSocket).emit(NEW_MESSAGE_ALERT, { chatId });

    try {
      await Message.create(messageForDB)
    } catch (error) {
      console.log('error==', error)
    }
  });

  socket.on(START_TYPING, ({ members, chatId }) => {

    const membersSocket = getSockets(members)
    socket.to(membersSocket).emit(START_TYPING, { chatId })
  })

  socket.on(STOP_TYPING, ({ members, chatId }) => {

    const membersSocket = getSockets(members)
    socket.to(membersSocket).emit(STOP_TYPING, { chatId })
  })


  socket.on(CHAT_JOINED, ({ userId, members }) => {
    console.log("joined", userId);
    
  onlineUsers.add(userId.toString())

  const membersSocket = getSockets(members)

  io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));
}
)

socket.on(CHAT_LEAVED, ({ userId, members }) => {
  console.log("leaved", userId);
  
  onlineUsers.delete(userId.toString())

  const membersSocket = getSockets(members)
  io.to(membersSocket).emit(ONLINE_USERS, Array.from(onlineUsers));


})



  socket.on("disconnect", () => {
    console.log("user disconnected");
    userSocketIds.delete(user._id.toString());
      onlineUsers.delete(user._id.toString())
      socket.broadcast.emit(ONLINE_USERS, Array.from(onlineUsers))
  });
});




app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`server is running PORT: ${port} in ${envMode} Mode`);
});



export { adminSecretKey, app, envMode, server, userSocketIds };

