const express = require("express");
const router = express.Router();

const { signup, login, logout, updatePassword, updateProfile } = require("../controllers/auth");
const { protect } = require("../middleware/jwt");
const validateRequest = require("../middleware/validateRequest");
const {
  signupSchema,
  loginSchema,
} = require("../validators/authValidator");

// Signup
router.post("/signup", validateRequest(signupSchema), signup);

// Login
router.post("/login", validateRequest(loginSchema), login);

// Logout
router.post("/logout", logout);

// Profile Settings
router.put("/update-password", protect, updatePassword);
router.put("/update-profile", protect, updateProfile);

module.exports = router;