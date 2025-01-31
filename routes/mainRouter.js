const { Router } = require("express");
const { body } = require("express-validator");
const mainRouter = Router();
const controller = require("../controllers/main");
const passport = require("passport");

//index page
mainRouter.get("/", controller.getMessages);

//signup page
mainRouter.get("/signup", controller.getSignup);
mainRouter.post(
  "/signup",
  body("confirm", "Passwords do not match").custom((value, { req }) => {
    console.log(value);
    console.log(req.body.password);
    return value === req.body.password;
  }),
  controller.postSignup
);

//login page
mainRouter.get("/login", controller.getLogin);
mainRouter.post(
  "/login/password",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
  })
);

//club membership page
mainRouter.get("/club", controller.getClub);
mainRouter.post("/club", controller.postClub);

module.exports = {
  mainRouter,
};
