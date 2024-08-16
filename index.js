const express = require("express")
const app = express()
const mongoose = require("mongoose");
require("dotenv").config()
const userRouter = require("./routes/userRouter")
const postRouter = require("./routes/postRouter")
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');

const port = process.env.port

app.use(cookieParser());
app.use(cors());
app.use(express.json())

app.use("/posts", postRouter)
app.use("/auth", userRouter)
app.use('/images/profilePhotos', express.static(path.join(__dirname, 'uploads/profilePhotos')));
app.use('/uploads/posts', express.static(path.join(__dirname, 'uploads/posts')));



mongoose.connect(
  process.env.DB_URL
)
  .then(() => {
    console.log("Connected To MongoDB"),
      app.listen(port, () => {
        console.log("Server running on localhost:" + port);
      });
  })
  .catch((err) => console.log(`unable to connet with dB : ${err.stack} `));