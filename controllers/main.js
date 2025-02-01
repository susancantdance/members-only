const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

async function getMessages(req, res) {
  const messages = await db.getMemberMessages();
  console.log("getMessages controller");

  res.render("index", { messages: messages, user: req.user });
}

async function getSignup(req, res) {
  res.render("signup");
}

async function postSignup(req, res, next) {
  const errors = validationResult(req);
  let admin = false;
  if (req.body.admin == "yes") {
    admin = true;
  }
  if (!errors.isEmpty()) {
    return res.send(errors.array()[0].msg);
  }
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await db.postSignup(
      req.body.username,
      hashedPassword,
      req.body.firstName,
      req.body.lastName,
      admin
    );

    res.redirect("/login");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

async function getClub(req, res, next) {
  res.render("club", { user: req.user });
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
      res.send("wrong, honey. passwords don't match. sorry");
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

async function logout(req, res, next) {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
}

async function getNewMsg(req, res, next) {
  res.render("msg", { user: req.user });
}

async function postNewMsg(req, res, next) {
  const time = new Date();
  console.log(time);
  await db.postNewMsg(req.body.title, time, req.body.message, req.user.id);
  res.redirect("/");
}

async function deleteMsg(req, res, next) {
  await db.deleteMsg(req.body.messageId);
  res.redirect("/");
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
  logout,
  getNewMsg,
  postNewMsg,
  deleteMsg,
  // postLogin,
};
