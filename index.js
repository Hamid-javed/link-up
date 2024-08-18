const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/userSchema");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const userDataRouter = require("./routes/userDataRouter");
const groupRouter = require("./routes/groupRouter");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const server = http.createServer(app);
const io = new Server(server);

const port = process.env.port;

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/posts", postRouter);
app.use("/user-data", userDataRouter);
app.use("/auth", userRouter);
app.use("/groups", groupRouter);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});



let users = {};

// Making connection with socket 
io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("join", async (userId) => {
    try {
      const user = await User.findById(userId);
      if (user) {
        users[userId.toString()] = socket.id;
        console.log(`${user.name} joined with socket ID: ${socket.id}`);
      } else {
        console.log("User not found");
      }
    } catch (err) {
      console.log("Error fetching user:", err);
    }
  });

  socket.on("private message", async ({ from, to, message }) => {
    try {
      const sender = await User.findById(from);
      const receiver = await User.findById(to);
      if (sender) {
        const recipientSocketId = users[to.toString()];
        if (recipientSocketId) {
          io.to(recipientSocketId).emit("private message", {
            from: sender.name,
            message,
          });
          console.log(`Message from ${sender.name} to ${to}: ${receiver.name}`);
        } else {
          console.log(`User ${to} is not connected`);
        }
      } else {
        console.log("Sender not found");
      }
    } catch (err) {
      console.log("Error fetching sender user:", err);
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    const userId = Object.keys(users).find(key => users[key] === socket.id);
    if (userId) {
      delete users[userId]; 
      console.log(`User with ID ${userId} disconnected`);
    }
  });
});

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected To MongoDB"),
      server.listen(port, () => {
        console.log("Server running on localhost:" + port);
      });
  })
  .catch((err) => console.log(`unable to connet with dB : ${err.stack} `));
