const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();
const User = require("./models/userSchema")
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



// To store user and their sockets Id
let users = {};

io.on("connection", (socket) => {
  console.log("A user connected");

  // userId recive from frontend
  socket.on("join", async (userId) => {
    try {
      const user = await User.findById(userId); // Fetch user from database by ID
      if (user) {
        users[userId.toString()] = socket.id; // Map user ID to socket ID
        console.log(`${user.name} joined with socket ID: ${socket.id}`);
      } else {
        console.log("User not found");
      }
    } catch (err) {
      console.log("Error fetching user:", err);
    }
  });


  socket.on("private message", ({ from, to, message }) => {
    // Fetch the recipient user from the database
    User.findById(to)
      .then((recipient) => {
        console.log(recipient)
        if (recipient) {
            io.to(recipient._id).emit("private message", { from, message });
            console.log(`Message from ${from} to ${to}: ${message}`);
        } else {
          console.log(`User ${to} not found`);
        }
      })
      .catch((err) => {
        console.log("Error fetching recipient user:", err);
      });
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
    // Remove the user from the active users list
    for (let userId in users) {
      if (users[userId] === socket.id) {
        delete users[userId];
        console.log(`${userId} has disconnected`);
        break;
      }
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
