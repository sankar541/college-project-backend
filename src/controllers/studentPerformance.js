const Student = require("../models/Student");
const Marks = require("../models/Marks");

exports.getStudentPerformance = async (req, res) => {
  let { registrationNumber } = req.params;

  // Fallback if frontend accidentally passes literal "undefined" string
  if (!registrationNumber || registrationNumber === "undefined") {
    registrationNumber = req.user.registrationNumber;
  }

  let student;
  // Try to find by registration number first
  if (registrationNumber) {
    student = await Student.findOne({ registrationNumber });
  } 
  
  // If no registrationNumber existed in the Auth User model, fallback to searching by name
  if (!student && req.user?.name) {
    student = await Student.findOne({ name: req.user.name });
    if (student) registrationNumber = student.registrationNumber;
  }

  if (!student || !registrationNumber) {
    return res.status(404).json({
      status: "fail",
      message: "Student details not found."
    });
  }

  const marks = await Marks.find({ registrationNumber })
    .populate("subject", "name code semester");

  const performance = marks.map(m => ({
    subject: m.subject?.name || "Unknown Subject",
    code: m.subject?.code || "N/A",
    semester: m.subject?.semester || student.semester, // Historical linkage securely tracking legacy cohort integer organically
    marks: m.marks,
    grade: m.grade
  }));

  res.status(200).json({
    status: "success",
    student: {
      name: student.name,
      registrationNumber: student.registrationNumber,
      branch: student.branch,
      semester: student.semester
    },
    performance
  });
};