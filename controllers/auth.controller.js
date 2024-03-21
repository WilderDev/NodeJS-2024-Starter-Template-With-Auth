// * IMPORTS
const User = require("../models/User.model.js");
const Token = require("../models/Token.model.js");
const crypto = require("crypto");
const { sendResetPasswordEmail, sendVerificationEmail } = require("../lib/utils/nodemailer");
const { attachCookies } = require("../lib/utils/jwt");
const {good, bad} = require('../lib/utils/res') // TODO: Use these functions to send responses

// * CONTROLLERS
// CONTROLLER: Register User
const registerUser = async (req, res) => {
	const { email, password1, password2, username } = req.body;

	const emailTaken = await User.findOne({ email });
	if (emailTaken) {
		return res.status(400).json({
			success: false,
			data: { message: "invalid username or email" }
		});
	}
	const usernameTaken = await User.findOne({ username });
	if (usernameTaken) {
		return res.status(400).json({
			success: false,
			data: { message: "invalid username or email" }
		});
	}

	const isFirstUser = (await User.countDocuments({})) === 0;
	const role = isFirstUser ? "admin" : "user";

	const verificationToken = crypto.randomBytes(2 ** 8).toString("hex");

	if (!email || !password1 || !password2 || !username) {
		return res.status(400).json({
			success: false,
			data: { message: "invalid form submission" }
		});
	}
	if (password1 !== password2) {
		return res.status(400).json({
			success: false,
			data: { message: "passwords do not match" }
		});
	}
	const user = await User.create({
		email,
		password: password1,
		username,
		role,
		verificationToken
	});

	let serverUrlString;

	await sendVerificationEmail({
		username: user.username,
		email: user.email,
		verificationToken: user.verificationToken,
		url: serverUrlString
	});

	res.status(200).json({ success: true, data: { user } });
};

// CONTROLLER: Login User
const loginUser = async (req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return res.status(400).json({
			success: false,
			data: { message: "please provide email and password" }
		});
	}
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(401).json({
			success: false,
			data: { message: "invalid username or password" }
		});
	}
	const isPassCorrect = await user.comparePass(password);
	if (!isPassCorrect) {
		return res.status(401).json({
			success: false,
			data: { message: "invalid username or password" }
		});
	}
	if (!user.isVerified) {
		return res.status(401).json({
			success: false,
			data: { message: "user account requires email verification" }
		});
	}

	const tokenUser = { name: user.username, userId: user._id, role: user.role };
	let refreshToken = "";

	const existingToken = await Token.findOne({ user: user._id });
	if (existingToken) {
		const { isValid } = existingToken;
		if (!isValid) {
			return res.status(401).json({
				success: false,
				data: { message: "invalid credentials" }
			});
		}
		refreshToken = existingToken.refreshToken;
		console.log(refreshToken);
		attachCookies({ res, user: tokenUser, refreshToken });
		res.status(200).json({ success: true, data: { user: tokenUser } });
		return;
	}

	refreshToken = crypto.randomBytes(40).toString("hex");
	const userAgent = req.headers["user-agent"];
	const ip = req.ip;
	const userToken = { refreshToken, ip, userAgent, user: user._id };

	await Token.create(userToken);

	attachCookies({ res, user: tokenUser, refreshToken });
	res.status(200).json({ success: true, data: { user: tokenUser } });
};

// CONTROLLER: Logout User
const logoutUser = async (req, res) => {
	await Token.findOneAndDelete({ user: req.user.userId });
	res.cookie("accessToken", "logout", {
		httpOnly: true,
		expires: new Date(Date.now())
	});
	res.cookie("refreshToken", "logout", {
		httpOnly: true,
		expires: new Date(Date.now())
	});
	res.status(200).json({ success: true, data: { message: "user logged out" } });
};

// CONTROLLER: Forgot Password
const forgotPass = async (req, res) => {
	const { email } = req.body;
	if (!email) {
		res.status(400).json({ success: false, data: { message: "email not valid" } });
	}
	const user = await User.findOne({ email });

	let serverUrlString;

	if (user) {
		const passwordToken = crypto.randomBytes(70).toString("hex");
		await sendResetPasswordEmail({
			username: user.username,
			email: user.email,
			passwordToken: passwordToken,
			url: serverUrlString
		});
		const tenMinutes = 1000 * 60 * 10;
		const passwordTokenExpirationDate = new Date(Date.now() + tenMinutes);

		user.passwordToken = crypto.createHash(passwordToken);
		user.passwordTokenExpirationDate = passwordTokenExpirationDate;
		await user.save();
	}
	res.status(200).json({ success: true, data: { message: "check email for reset link" } });
};

// CONTROLLER: Reset Password
const resetPass = async (req, res) => {
	const { token, email, password } = req.body;
	if (!token || !email || !password) {
		res.status(400).json({ success: false, data: { message: "please provide all values" } });
	}
	const user = await User.findOne({ email });
	if (user && user.passwordToken && user.passwordTokenExpirationDate) {
		const currentDate = new Date();
		if (
			user.passwordToken === crypto.createHash(token) &&
			user.passwordTokenExpirationDate > currentDate
		) {
			user.password = password;
			user.passwordToken = null;
			user.passwordTokenExpirationDate = null;
			await user.save();
			res.status(200).json({ success: true, data: { message: "password reset success" } });
		} else {
			res.status(400).json({ success: false, data: { message: "invalid token" } });
		}
	} else {
		res.status(400).json({ success: false, data: { message: "please try again" } });
	}
};

// CONTROLLER: Verify Email
const verifyEmail = async (req, res) => {
	const { verificationToken, email } = req.body;
	const user = await User.findOne({ email });
	if (!user) {
		return res.status(401).json({
			success: false,
			data: { message: "verification failed" }
		});
	}
	if (user.verificationToken !== verificationToken) {
		return res.status(401).json({
			success: false,
			data: { message: "verification failed" }
		});
	}

	user.isVerified = true;
	user.verified = Date.now();
	user.verificationToken = "";
	await user.save();

	return res.status(200).json({
		success: true,
		data: { message: "email verified" }
	});
};

// * EXPORTS
const me = async (req, res) => {
	const user = await User.findOne({ _id: req.user.userId });
    if (!user) {
		// TODO: Change this to the correct res resonse
        return res.status(401).json({
            success: false,
            data: { message: "user not signed in" }
        });
    }
    res.status(200).json({ success: true, data: { user } });
}

module.exports = { registerUser, loginUser, logoutUser, forgotPass, resetPass, verifyEmail, me };
