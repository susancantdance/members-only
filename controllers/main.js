const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

async function getMessages(req, res) {
  const messages = await db.getMessages();
  console.log("getMessages controller");
  console.log(req.user);
  res.render("index", { messages: messages, user: req.user });
}

async function getSignup(req, res) {
  res.render("signup");
}

async function postSignup(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.send(errors.array()[0].msg);
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    // console.log(req.body.username + "pw" + hashedPassword);
    await db.postSignup(req.body.username, hashedPassword);

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function getClub(req, res, next) {
  console.log("get club function");
  console.log(req.user.username);
  res.render("club");
}

async function postClub(req, res, next) {
  try {
    console.log("postclub function");
    console.log(req.body.password);
    console.log(req.body.username);
    const rows = await db.checkUserExists(req.body.username);
    const user = rows[0];
    const match = await bcrypt.compare(req.body.password, user.password);
    console.log(`match:`);
    console.log(match);
    if (!match) {
      // passwords do not match!
      res.send("wrong honey. sorry");
    }
    console.log(`calling update membersship(${req.user.username})`);
    await db.updateMembership(req.user.username);
    res.redirect("/");
  } catch (err) {
    res.send(`ERROR: ${err.message}`);
  }
}

async function getLogin(req, res, next) {
  res.render("login");
}

// async function postLogin(req, res, next) {
//   passport.authenticate("local", {
//     successRedirect: "/",
//     failureRedirect: "/login",
//   })(req, res, next);
// }

module.exports = {
  getMessages,
  getSignup,
  postSignup,
  getClub,
  getLogin,
  postClub,
  // postLogin,
};
