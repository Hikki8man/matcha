const jwt = require("jsonwebtoken");
const userRepo = require("../UserAccount/userAccount");
const emailService = require("../Emailer/emailer");
const HttpError = require("../Utils/errors");
const auth = require("./auth");

function signToken(payload, option) {
  return jwt.sign(payload, process.env.TOKEN_SECRET, option);
}

async function sendValidationMail(user) {
  const token = signToken({id: user.id}, {expiresIn: "3d"});
  await userRepo.insert_validation_token(user.id, token);
  await emailService.sendValidationMail(user, token);
}

async function validateAccount(id, token) {
  const user_account = await userRepo.get_with_token(id);
  if (!user_account) {
    console.log("User not found in validate account");
    throw new HttpError(404, "User not found");
  }
  if (user_account.verified) {
    console.log("Account already verified");
    throw new HttpError(400, "Account already verified");
  } else if (token !== user_account.token_validation) {
    throw new HttpError(400, "Invalid token");
  }
  return await userRepo.set_verified(id);
}

function generateAccessAndRefreshToken(user_account) {
  const access_token = signToken({id: user_account.id}, {expiresIn: "4h"});
  const refresh_token = signToken({id: user_account.id}, {expiresIn: "1d"});
  return {access_token, refresh_token};
}

module.exports = {
  signToken,
  sendValidationMail,
  validateAccount,
  generateAccessAndRefreshToken,
};
