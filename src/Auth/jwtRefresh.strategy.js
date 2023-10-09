const jwt = require("jsonwebtoken");

function jwtRefreshStrategy(req, res, next) {
  const refresh_token = req.cookies.refresh_token;
  try {
    const user = jwt.verify(refresh_token, process.env.TOKEN_SECRET);
    req.user = user;
    next();
  } catch (err) {
    res.clearCookie("refresh_token");
    res.status(403).send("Token expired");
  }
}

module.exports = jwtRefreshStrategy;
