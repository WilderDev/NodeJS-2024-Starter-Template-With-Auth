// * Nodemailer Config
const nodemailerConfig = {
	host: process.env.NODEMAILER_HOST,
	port: process.env.NODEMAILER_PORT,
	auth: {
		user: process.env.NODEMAILER_USER,
		pass: process.env.NODEMAILER_PASSWORD
	}
};

// * EXPORTS
module.exports = nodemailerConfig;
