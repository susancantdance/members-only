const express = require("express");
const app = express();
const path = require("node:path");
const session = require("express-session");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("./db/queries");
const mypool = require("./db/pool");

const mainRouter = require("./routes/mainRouter").mainRouter;

app.use(express.urlencoded({ extended: true }));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      pool: mypool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 },
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const rows = await db.deserialize(id);
    const user = rows[0];

    done(null, user);
  } catch (err) {
    done(err);
  }
});

app.use(passport.session());

app.use("/", mainRouter);

passport.use(
  new LocalStrategy(async (username, password, done) => {
    console.log("im in the localstrategy function");
    try {
      const rows = await db.checkUserExists(username);
      const user = rows[0];
      console.log(`user:`);
      console.log(user);
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      console.log(`match:`);
      console.log(match);
      if (!match) {
        // passwords do not match!
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Inventory app - listening on port ${PORT}!`);
});
