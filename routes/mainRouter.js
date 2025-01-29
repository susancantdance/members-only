const { Router } = require("express");
const { body } = require("express-validator");
const mainRouter = Router();
const controller = require("../controllers/main");

mainRouter.get("/", controller.getMessages);
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

module.exports = {
  mainRouter,
};
