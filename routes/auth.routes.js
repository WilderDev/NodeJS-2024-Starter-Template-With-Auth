// * IMPORTS
const express = require("express");
const {
	registerUser,
	loginUser,
	verifyEmail,
	logoutUser,
	resetPass,
	forgotPass
} = require("../controllers/auth.controller");
const { authenticateUser } = require("../middleware/auth.middleware");

// * INIT ROUTER
const router = express.Router();

// * ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);
router.delete("/logout", authenticateUser, logoutUser);
router.post("/verify", verifyEmail);
router.post("/reset-password", resetPass);
router.post("/forgot-password", forgotPass);
router.get("/me", authenticateUser, me)

// * EXPORTS
module.exports = router;
