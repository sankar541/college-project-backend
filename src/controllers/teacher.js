const User = require("../models/User");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");

exports.getAllTeachers = catchAsync(async (req, res, next) => {
  const teachers = await User.find({ role: "teacher" }).select("name email registrationNumber");

  res.status(200).json({
    status: "success",
    results: teachers.length,
    data: teachers
  });
});

exports.createTeacher = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new appError("All fields are required", 400));
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new appError("Account with this email already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    role: "teacher",
  });

  res.status(201).json({
    status: "success",
    data: user
  });
});
