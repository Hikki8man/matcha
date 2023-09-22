const express = require("express");
const app = express();
const db = require("./dbconnect");
const userRoute = require("./Users/users.route");
const authRoute = require("./Auth/auth.route");
const cookieParser = require("cookie-parser");
const cors = require("cors");

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
app.use(userRoute);
app.use(authRoute);
app.listen(8080);
