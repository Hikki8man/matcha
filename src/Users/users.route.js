const express = require('express');
const userRoute = express.Router();
const userRepository = require('./users');
const db = require('../dbconnect');
const jwtStrategy = require('../Auth/jwt.strategy');

// const { body, validationResult } = require('express-validator');

// class UserValidator {
//   static validateCreateUser(req, res, next) {
//     // Use express-validator to define validation rules for the request body
//     const validationRules = [
//       body('name').isLength({ min: 3 }).withMessage('Name must be at least 3 characters long'),
//       body('email').isEmail().withMessage('Invalid email address'),
//     ];

//     // Apply validation rules to the request
//     Promise.all(validationRules.map(rule => rule.run(req)))
//       .then(() => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//           // Validation failed, return an error response
//           return res.status(400).json({ errors: errors.array() });
//         }
//         // Validation passed, continue to the next middleware or route handler
//         next();
//       });
//   }
// }


function validateIdParam(req, res, next) {
	const id = req.params.id;
	const parsedId = parseInt(id, 10);
  
	if (isNaN(parsedId) || parsedId.toString() !== id) {
	  // If the parsed result is NaN or the parsed result doesn't match the original string,
	  // it's not a valid integer.
	  return res.status(400).send('Invalid ID parameter. Must be an integer.');
	}
	next();
  }
  
const userRepo = new userRepository(db);

// userRoute.post('/user', (req, res) => {
// 	// console.log(req.body);
// 	const user = userRepo.create(req.body);
// 	// console.log(user);
// 	res.send(user);
// })

userRoute.get('/user/liked', jwtStrategy, async (req, res) => {
	const users = await userRepo.get_likers(req.user.id);
	res.send(users);
});

userRoute.get('/user/:id', validateIdParam, async (req, res) => {
	const user = await userRepo.get_by_id(req.params.id);
	if (!user) {
		res.status(404).send("User not found");
	}
	else {
		res.send(user);
	}
})

module.exports = userRoute;