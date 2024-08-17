const express = require("express")
const http = require("http");
const { Server } = require("socket.io");
const app = express()
const mongoose = require("mongoose");
require("dotenv").config()
const userRouter = require("./routes/userRouter")
const postRouter = require("./routes/postRouter")
const userDataRouter = require("./routes/userDataRouter")
const chatRouter = require("./routes/chatRouter")
const cookieParser = require('cookie-parser');
const cors = require('cors');

const server = http.createServer(app);
const io = new Server(server);

const port = process.env.port

app.use(cookieParser());
app.use(cors());
app.use(express.json())

app.use("/posts", postRouter)
app.use("/user-data", userDataRouter)
app.use("/auth", userRouter)
app.use("/chat", chatRouter)



io.on('connection', (socket) => {
  socket.on('message', (message) => {
    // Get the chat session ID from the message
    const chatSessionId = message.chatSessionId;

    // Get the chat session from the database
    ChatSession.findById(chatSessionId, (err, chatSession) => {
      if (err) {
        console.error(err);
      } else {
        // Broadcast the message to the other user
        io.emit('message', message);
      }
    });
  });
});








mongoose.connect(
  process.env.DB_URL
)
  .then(() => {
    console.log("Connected To MongoDB"),
      server.listen(port, () => {
        console.log("Server running on localhost:" + port);
      });
  })
  .catch((err) => console.log(`unable to connet with dB : ${err.stack} `));