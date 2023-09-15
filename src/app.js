const express = require('express');
const app = express();
const db = require('./dbconnect');
const userRoute = require('./Users/users.route');
const authRoute = require('./Auth/auth.route');
const cookieParser = require('cookie-parser');

app.use(express.json());
app.use(
	express.urlencoded({
		extended: true,
	})
);
app.use(cookieParser());
app.use(userRoute);
app.use(authRoute);
app.listen(3000);
