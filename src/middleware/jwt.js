const jwt = require("jsonwebtoken");
const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const User = require("../models/User");

exports.protect = catchAsync(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies && req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new appError("You are not logged in. Please login first.", 401)
    );
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const currentUser = await User.findById(decoded.id);

  if (!currentUser) {
    return next(
      new appError("The user belonging to this token no longer exists.", 401)
    );
  }

  req.user = currentUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    const userRole = (req.user.role || "undefined").toLowerCase();
    const allowedRoles = roles.map(r => r.toLowerCase());
    
    if (!allowedRoles.includes(userRole)) {
      return next(
        new appError(`You do not have permission to perform this action. Your role: '${userRole}'. Allowed: '${allowedRoles.join(", ")}'`, 403)
      );
    }
    next();
  };
};