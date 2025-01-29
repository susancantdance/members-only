const express = require("express");
const app = express();
const path = require("node:path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const mainRouter = require("./routes/mainRouter").mainRouter;

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.session());

app.use("/", mainRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Inventory app - listening on port ${PORT}!`);
});
