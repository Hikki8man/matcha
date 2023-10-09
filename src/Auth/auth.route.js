const express = require("express");
const authRoute = express.Router();
const userRepo = require("../UserAccount/userAccount");
const profileRepo = require("../Profile/profile");
const jwt = require("jsonwebtoken");
const auth = require("./auth");
const jwtStrategy = require("./jwt.strategy");
const HttpError = require("../Utils/errors");
const signupValidation = require("../Validations/signupValidation");
const {body, validationResult} = require("express-validator");
const jwtRefreshStrategy = require("./jwtRefresh.strategy");

authRoute.post("/auth/register", signupValidation, async (req, res) => {
  // console.log("body", req.body);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log("errors: ", errors);
    return res.status(400).send(errors);
  }
  const user = await userRepo.create(req.body);
  console.log("user", user);
  if (user) {
    await auth.sendValidationMail(user);
  }
  res.status(201).send(user);
});

//TEST
// authRoute.post("/auth/send-email", jwtStrategy, async (req, res) => {
//   // console.log("body", req.body);
//   const user = await userRepo.get_by_id(req.user.id);
//   console.log("user send-mail", user);
//   if (user) {
//     await auth.sendValidationMail(user);
//   }
//   res.status(201).send(user);
// });

authRoute.post("/auth/login", async (req, res) => {
  const user_account = await userRepo.validate_login(req.body);
  const profile = await profileRepo.get_by_id(user_account.id);
  if (user_account === undefined) {
    res.status(401).send("Email or Password incorrect");
  } else {
    const {access_token, refresh_token} =
      auth.generateAccessAndRefreshToken(user_account);
    res.cookie("access_token", access_token, {httpOnly: true});
    res.cookie("refresh_token", refresh_token, {httpOnly: true});

    res.send({user_account, profile});
  }
});

authRoute.post("/auth/validate-account", async (req, res, next) => {
  const {id, token} = req.body;
  try {
    const user_account = await auth.validateAccount(id, token);
    console.log("user validated", user_account);
    const signed_token = auth.signToken(
      {id: user_account.id, name: user_account.name},
      {expiresIn: "30m"}
    );
    console.log("signed token", signed_token);
    res.cookie("token", signed_token, {
      httpOnly: true,
    });
    res.send(user_account);
  } catch (err) {
    next(err);
  }
});

authRoute.post("/auth/check-token", jwtStrategy, async (req, res, next) => {
  const user = await userRepo.get_by_id(req.user.id);
  if (!user) {
    return next(new HttpError(400, "user not found"));
  }
  res.send(user);
});

authRoute.get("/auth/refresh", jwtRefreshStrategy, async (req, res) => {
  // console.log("token refreshed");
  const user_acc = await userRepo.get_by_id(req.user.id);
  const access_token = auth.signToken(
    {id: req.user.id, name: req.user.name},
    {expiresIn: "15m"}
  );
  res.cookie("access_token", access_token);
  res.send(user_acc);
});

authRoute.post("/auth/logout", async (req, res) => {
  console.log("loging out");
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  res.end();
});

module.exports = authRoute;
