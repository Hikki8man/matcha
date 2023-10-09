const jwt = require("jsonwebtoken");

function jwtStrategy(req, res, next) {
  const access_token = req.cookies.access_token;
  try {
    const user = jwt.verify(access_token, process.env.TOKEN_SECRET);
    req.user = user;
    next();
  } catch (err) {
    console.log("access token expired");
    res.clearCookie("access_token");
    res.status(403).send("Token expired");
  }
}

module.exports = jwtStrategy;
