// IMPORTS
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const connectToMongo = require("./lib/mongo");
const cookieParser = require("cookie-parser");

// CONSTANTS
const app = express();

let port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(cors());
app.use(cookieParser(process.env.CP_SECRET));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ROUTES
// app.use("/chat", chatRoutes);
app.use("/auth", authRoutes);

// METHODS
(async () => {
	try {
		await connectToMongo(process.env.MONGO_URI);
		app.listen(port, () => {
			console.log(`listening on http://localhost:${port} ...`);
		});
	} catch (err) {
		console.log(err);
	}
})();
