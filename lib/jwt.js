const jwt = require("jsonwebtoken");

const isTokenValid = (token) => jwt.verify(token, process.env.JWT_SECRET);

const attachCookies = ({ res, user, refreshToken }) => {
	const accessTokenJWT = jwt.sign({ payload: { user } }, process.env.JWT_SECRET);
	const refreshTokenJWT = jwt.sign({ payload: { user, refreshToken } }, process.env.JWT_SECRET);

	const oneHour = 1000 * 60 * 60;
	const oneDay = 1000 * 60 * 60 * 24;
	res.cookie("accessToken", accessTokenJWT, {
		httpOnly: true,
		expires: new Date(Date.now() + oneHour),
		secure: process.env.NODE_ENV === "production",
		signed: true
	});
	res.cookie("refreshToken", refreshTokenJWT, {
		httpOnly: true,
		expires: new Date(Date.now() + oneDay),
		secure: process.env.NODE_ENV === "production",
		signed: true
	});
	console.log(res);
};

module.exports = { isTokenValid, attachCookies };
