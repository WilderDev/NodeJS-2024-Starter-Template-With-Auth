const nodemailer = require("nodemailer");
const nodemailerConfig = require("./nodemailer-config");

const sendEmail = async ({ to, subject, html }) => {
	await nodemailer.createTestAccount();
	const transporter = nodemailer.createTransport(nodemailerConfig);
	return transporter.sendMail({
		from: '"stream-project" <stream-project@email.com>',
		to,
		subject,
		html
	});
};

const sendVerificationEmail = async ({ username, email, verificationToken, url }) => {
	const verifyLink = `${url}/verify?token=${verificationToken}&email=${email}`;
	const message = `<h2>Welcome to Stream Project</h2><p>Thanks for creating an account ${username}. click <a href="${verifyLink}" target="_blank">here</a> to verify your email</p>`;
	return sendEmail({ to: email, subject: "Email Confirmation", html: message });
};

const sendResetPasswordEmail = async ({ username, email, passwordToken, url }) => {
	const resetLink = `${url}/user/reset-password?token=${passwordToken}&email=${email}`;
	const message = `<h2>Reset Password</h2><p>${username}, Please click on the following link to reset your password.</p><br /><p><a href="${resetLink}" target="_blank">Reset Password</a> to verify your email</p>`;
	return sendEmail({ to: email, subject: "Password Reset", html: message });
};

module.exports = { sendEmail, sendVerificationEmail, sendResetPasswordEmail };
