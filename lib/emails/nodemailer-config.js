const nodemailerConfig = {
	host: "smtp.ethereal.email",
	port: 587,
	auth: {
		user: "beryl.russel@ethereal.email", // TODO: Come from ENV
		pass: "HbgDbmRCc97QUjTnW3" // TODO: Come from ENV
	}
};

module.exports = nodemailerConfig;
