const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const mongoose = require("mongoose");
require("dotenv").config();
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const userDataRouter = require("./routes/userDataRouter");
const notificationRouter = require("./routes/notificationRouter");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const port = process.env.port || 4000;

app.use(cookieParser());
app.use(cors());
app.use(express.json());

// Initialize routers after io is created
app.use("/posts", postRouter);
app.use("/user-data", userDataRouter);
app.use("/auth", userRouter);
app.use('/notifications', notificationRouter(io));

mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected To MongoDB");
    server.listen(port, () => {
      console.log("Server running on localhost:" + port);
    });
  })
  .catch((err) => console.log(`Unable to connect with DB: ${err.stack}`));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('sendNotification', (data) => {
        const { userId, message } = data;
        io.to(userId).emit('receiveNotification', { message });
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});
