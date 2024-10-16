const express = require("express");
const connectDB = require("./config/database");
const bcrypt = require("bcrypt");
const { isJWT } = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

app.post("/sendConnectionRequest", userAuth, (req, res) => {
  res.send("Send Connection Request");
});

connectDB()
  .then(() => {
    console.log("database connection established");
    app.listen(7777, () => console.log("App Listening on Port 7777"));
  })
  .catch((err) => console.log(err.message));
