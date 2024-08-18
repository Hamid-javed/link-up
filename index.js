const express = require("express");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config()
const userRouter = require("./routes/userRouter")
const postRouter = require("./routes/postRouter")
const userDataRouter = require("./routes/userDataRouter")
const groupRouter = require("./routes/groupRouter");
const notificationRouter = require("./routes/notificationRouter");
const cookieParser = require('cookie-parser');
const cors = require('cors');

const port = process.env.port;

app.use(cookieParser());
app.use(cors());
app.use(express.json());

app.use("/posts", postRouter)
app.use("/user-data", userDataRouter)
app.use("/auth", userRouter)
app.use("/groups", groupRouter)
app.use('/notifications', notificationRouter);



mongoose.connect(process.env.DB_URL)
  .then(() => {
    console.log("Connected To MongoDB"),
      app.listen(port, () => {
        console.log("Server running on localhost:" + port);
      });
  })
  .catch((err) => console.log(`unable to connect with dB : ${err.stack} `));
