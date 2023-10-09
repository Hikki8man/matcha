const express = require("express");
const userAccountRoute = express.Router();
const userRepo = require("./userAccount");
const jwtStrategy = require("../Auth/jwt.strategy");

function validateIdParam(req, res, next) {
  const id = req.params.id;
  const parsedId = parseInt(id, 10);

  if (isNaN(parsedId) || parsedId.toString() !== id) {
    // If the parsed result is NaN or the parsed result doesn't match the original string,
    // it's not a valid integer.
    return res.status(400).send("Invalid ID parameter. Must be an integer.");
  }
  next();
}

userAccountRoute.get("/user/liked", jwtStrategy, async (req, res) => {
  const users = await userRepo.get_likers(req.user.id);
  res.send(users);
});

userAccountRoute.get("/user/:id", validateIdParam, async (req, res) => {
  console.log("profile/:id params", req.params.id);
  const id = Number(req.params.id);
  const user = await userRepo.get_by_id(id);
  if (!user) {
    res.status(404).send("User not found");
  } else {
    console.log("user found", user);
    res.send(user);
  }
});

// userAccountRoute.post("/send-email", jwtStrategy, async (req, res) => {});

module.exports = userAccountRoute;
