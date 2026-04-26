const Marks = require("../models/Marks");
const Subject = require("../models/Subject");
const Student = require("../models/Student");
const catchAsync = require("../utils/catchAsync");
const appError = require("../utils/appError");
const gradeCalculator = require("../utils/gradeCalculator");


// ================= GET STUDENTS FOR SUBJECT =================
// Teacher selects subject → gets all students
exports.getStudentsBySubject = catchAsync(async (req, res, next) => {

  const { subjectId } = req.params;

  const subject = await Subject.findById(subjectId);

  if (!subject) {
    return next(new appError("Subject not found", 404));
  }

  // 🔥 check teacher is assigned
  if (subject.teacher.toString() !== req.user._id.toString()) {
    return next(new appError("Not allowed to access this subject", 403));
  }

  // 🔥 get students already graded for this subject
  const gradedMarks = await Marks.find({ subject: subject._id }).distinct('student');

  // 🔥 find students having this subject, EXCLUDING ones already graded
  const students = await Student.find({
    subjects: subject._id,
    _id: { $nin: gradedMarks }
  });

  res.status(200).json({
    status: "success",
    results: students.length,
    data: students
  });

});


// ================= CREATE MARKS =================
exports.createMarks = catchAsync(async (req, res, next) => {

  const { registrationNumber, subjectId, marks } = req.body;

  if (!registrationNumber || !subjectId || marks === undefined) {
    return next(new appError("All fields are required", 400));
  }

  // 1️⃣ find subject using specific DB ID ensuring no branch mixups
  const subject = await Subject.findById(subjectId);

  if (!subject) {
    return next(new appError("Subject not found", 404));
  }

if (!subject.teacher || subject.teacher.toString() !== req.user._id.toString()) {
  return next(new appError("Not allowed", 403));
}

  // 3️⃣ find student
  const student = await Student.findOne({ registrationNumber });

  if (!student) {
    return next(new appError("Student not found", 404));
  }

  // 4️⃣ check student belongs to subject
  const isEnrolled = student.subjects && student.subjects.some(id => id.toString() === subject._id.toString());
  if (!isEnrolled) {
    return next(new appError("Student not enrolled in this subject", 400));
  }

  // 5️⃣ check for existing marks and UPSERT (Update or Create)
  let existing = await Marks.findOne({
    student: student._id,
    subject: subject._id
  });

  // 6️⃣ validate marks
  if (marks < 0 || marks > 100) {
    return next(new appError("Marks must be between 0 and 100", 400));
  }

  // 7️⃣ calculate grade
  const grade = gradeCalculator(marks);

  if (existing) {
    // If marks already exist, we update them instead of throwing an error
    existing.marks = marks;
    existing.grade = grade;
    await existing.save();

    return res.status(200).json({
      status: "success",
      data: existing
    });
  }

  // 8️⃣ create new marks if they don't exist
  const newMarks = await Marks.create({
    student: student._id,
    studentname: student.name,
    registrationNumber,
    subject: subject._id,
    marks,
    grade
  });

  res.status(201).json({
    status: "success",
    data: newMarks
  });
});


// ================= GET ALL MARKS =================
exports.getAllMarks = catchAsync(async (req, res) => {

  const marks = await Marks.find().populate("subject student");

  res.status(200).json({
    status: "success",
    results: marks.length,
    data: marks
  });

});


// ================= DELETE MARK =================
exports.deleteMarks = catchAsync(async (req, res, next) => {

  const marks = await Marks.findByIdAndDelete(req.params.id);

  if (!marks) {
    return next(new appError("Marks not found", 404));
  }

  res.status(200).json({
    status: "success",
    message: "Marks deleted"
  });

});