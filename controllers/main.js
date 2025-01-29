const db = require("../db/queries");
const bcrypt = require("bcryptjs");
const { validationResult } = require("express-validator");

async function getMessages(req, res) {
  const messages = await db.getMessages();
  res.render("index", { messages: messages });
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

    res.redirect("/");
  } catch (error) {
    console.error(error);
    next(error);
  }
}

module.exports = {
  getMessages,
  getSignup,
  postSignup,
};
