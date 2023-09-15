const jwt = require('jsonwebtoken')

function jwtStrategy(req, res, next) {
	const token = req.cookies.token;
	// console.log("strat", token);
	try {
		const user = jwt.verify(token, process.env.TOKEN_SECRET);
		req.user = user
		// console.log(user);
		next();
	}
	catch (err) {
		//TODO status code etc
		res.clearCookie("token");
		res.send("Token expired");
	}
}

module.exports = jwtStrategy;