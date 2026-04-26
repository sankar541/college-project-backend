const User = require("../models/User");
const bcrypt = require("bcryptjs");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const  generateToken  = require("../utils/generateToken");

// ================= SIGNUP =================
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password, role } = req.body;


  if (!name || !email || !password) {
    return next(new appError("All fields are required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new appError("User already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || "student", // default role
  });

  const token = generateToken(user);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(201).json({
    status: "success",
    token,
    user,
  });
});

// ================= LOGIN =================
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new appError("Please provide email and password", 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new appError("Invalid credentials", 401));
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new appError("Invalid email or password", 401));
  }

  const token = generateToken(user);

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    status: "success",
    token,
    user,
  });
});

// ================= LOGOUT =================
exports.logout = (req, res) => {
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
};

// ================= UPDATE PASSWORD =================
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return next(new appError("Provide current and new passwords.", 400));
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
    return next(new appError("Incorrect current password.", 401));
  }

  user.password = newPassword;
  await user.save(); // pre-save hook handles hashing

  // Issue a fresh token natively verifying local secure states
  const token = generateToken(user);
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 14 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({ status: "success", message: "Password updated safely." });
});

// ================= UPDATE PROFILE (Photo) =================
exports.updateProfile = catchAsync(async (req, res, next) => {
  const { photo } = req.body;
  
  if (photo && photo.length > 5000000) { // Limit Base64 length ~5MB strictly securely
    return next(new appError("Image payload exceeds 5MB limit. Please downscale the image.", 400));
  }

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { photo },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    status: "success",
    user
  });
});
