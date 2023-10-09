const express = require("express");
const dotenv = require("dotenv");
dotenv.config({path: ".env"});
const app = express();
const db = require("./dbconnect");
const userAccountRoute = require("./UserAccount/userAccount.route");
const authRoute = require("./Auth/auth.route");
const profileRoute = require("./Profile/profile.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");

function errorHandler(err, req, res, next) {
  // Handle the error here
  console.error("error handle:", err.message);
  res.status(err.status || 500).send(err.message);
}

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(userAccountRoute);
app.use(authRoute);
app.use(profileRoute);
app.use(errorHandler);
app.listen(8080);
