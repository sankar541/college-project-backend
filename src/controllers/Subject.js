const Subject = require("../models/Subject");
const Student = require("../models/Student");
const catchAsync = require("../utils/catchAsync");
const appError =require("../utils/appError");

// exports.createSubject = catchAsync(async (req, res, next) => {
//   const { name, code, branch, semester,teacher } = req.body;

//   if (!name || !code || !branch || !semester) {
//     return next(new appError("All fields are required", 400));
//   }

//   const existing = await Subject.findOne({ code });
//   if (existing) {
//     return next(new appError("Subject already exists", 400));
//   }

//   const subject = await Subject.create({
//     name,
//     code,
//     branch,
//     semester
//   });

//   res.status(201).json({
//     status: "success",
//     data: subject
//   });
// });

exports.createSubject = catchAsync(async (req, res, next) => {
  const { name, code, branch, semester, teacher } = req.body;

  if (!name || !code || !branch || !semester || !teacher) {
    return next(new appError("All fields are required", 400));
  }

  const existing = await Subject.findOne({ code, branch, semester: Number(semester) });
  if (existing) {
    return next(new appError("Subject already exists precisely inside this exact branch and semester cohort", 400));
  }

  const subject = await Subject.create({
    name,
    code,
    branch,
    semester,
    teacher
  });

  // Dynamically auto-enroll all existing students into the newly instantiated subject matching their exact cohort.
  await Student.updateMany(
    { branch: branch, semester: Number(semester) }, 
    { $addToSet: { subjects: subject._id } }
  );

  res.status(201).json({
    status: "success",
    data: subject
  });
});


// Get all subjects
exports.getAllSubjects = catchAsync(async (req, res) => {
  let filter = {};
  
  // Teachers should only be allowed to see subjects exclusively assigned to them.
  if (req.user && req.user.role === 'teacher') {
    filter.teacher = req.user._id;
  }

  const subjects = await Subject.find(filter);

  res.status(200).json({
    status: "success",
    results: subjects.length,
    data: subjects
  });
});