const Student = require("../models/Student");
const Subject = require("../models/Subject");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const User = require("../models/User");



exports.createStudents = catchAsync(async (req, res, next) => {

  const { branch, semester, students } = req.body;

  if (!branch || !semester || !students || !students.length) {
    return next(new appError("Branch, semester and students are required", 400));
  }

  // 🔥 find subjects for branch + semester
  const subjects = await Subject.find({ branch, semester });

  let subjectIds = [];
  if (subjects && subjects.length > 0) {
    subjectIds = subjects.map(sub => sub._id);
  }

  const createdStudents = [];

  for (const student of students) {
  let { name, email, registrationNumber } = student;
  
  if (name) name = name.trim();
  if (email) email = email.trim();
  if (registrationNumber) registrationNumber = registrationNumber.trim();

  if (!name || !registrationNumber) continue;

  const existing = await Student.findOne({ registrationNumber });
  if (existing) continue;

  const newStudent = await Student.create({
    name,
    registrationNumber,
    branch,
    semester,
    subjects: subjectIds
  });

  await User.create({
    name,
    email: email || undefined, // Support email creation if passed
    registrationNumber,
    password: registrationNumber, // Default password is registration number
    role: "student"
  });

  createdStudents.push(newStudent);
}

  res.status(201).json({
    status: "success",
    message: "Students added successfully",
    count: createdStudents.length,
    data: createdStudents
  });
});

exports.getAllStudents = catchAsync(async (req, res, next) => {
  const { branch, semester } = req.query;
  const filter = {};
  
  if (branch) filter.branch = branch;
  if (semester) filter.semester = parseInt(semester);

  const students = await Student.find(filter).sort({ semester: -1, branch: 1, name: 1 });
  
  res.status(200).json({
    status: "success",
    results: students.length,
    data: students
  });
});

exports.promoteStudent = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const { newSemester } = req.body;

  if (!newSemester) {
     return next(new appError("Target semester parameter is missing explicitly.", 400));
  }

  const student = await Student.findById(id);
  if (!student) {
     return next(new appError("Requested student dataset not structurally located.", 404));
  }

  // Find exact exact cohort maps belonging strictly to their targeted new semester inherently natively.
  const targetSubjects = await Subject.find({ branch: student.branch, semester: newSemester });
  const mappedIds = targetSubjects.map(sub => sub._id);

  student.semester = newSemester;
  student.subjects = mappedIds; // Explicitly wipe archaic history replacing entirely with the active active mappings.

  await student.save();

  res.status(200).json({
     status: "success",
     message: "Student strictly promoted securely and natively updated arrays isolated successfully.",
     data: student
  });
});