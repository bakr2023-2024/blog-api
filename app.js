require("dotenv").config();
var express = require("express");
var path = require("path");
var logger = require("morgan");
const mongoose = require("mongoose");
const { isAuthenticated } = require("./authMiddleware");
mongoose.connect(process.env.MONGO_URI);
var app = express();
const passport = require("./passportConfig");
const session = require("express-session");
const flash = require("express-flash");
const homeRouter = require("./routes/homeRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const postRouter = require("./routes/postRouter");
const commentRouter = require("./routes/commentRouter");
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(flash());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use("/", authRouter);
app.use(isAuthenticated);
app.use("/", homeRouter);
app.use("/user", userRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
module.exports = app;
