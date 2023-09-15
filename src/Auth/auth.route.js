const express = require('express');
const authRoute = express.Router();
const userRepository = require('../Users/users');
const db = require('../dbconnect');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv')

const userRepo = new userRepository(db);
dotenv.config({ path: '../.env' });

authRoute.post('/auth/signup', (req, res) => {
	console.log(req.body);
	const user = userRepo.create(req.body);
	res.status(201).end();
})

authRoute.post('/auth/signin', async (req, res) => {
	const result = await userRepo.validate_login(req.body);
	if (result === undefined) {
		res.status(401).send("Email or Password incorrect");
	}
	else {
		const token = jwt.sign({ id: result.id, name: result.firstname }, process.env.TOKEN_SECRET, { expiresIn: '30m' });
		console.log(token)
		res.cookie("token", token, {
			httpOnly: true
		});
		res.send(result);
	}
})

module.exports = authRoute;