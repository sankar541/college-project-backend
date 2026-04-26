const express = require("express");
const router = express.Router();

const {
  createMarks,
  getAllMarks,
  deleteMarks,
  getStudentsBySubject
} = require("../controllers/marks");

const { protect, restrictTo } = require("../middleware/jwt");


// ================= GET STUDENTS FOR SUBJECT =================
// Teacher selects subject → get students
router.get(
  "/students/:subjectId",
  protect,
  restrictTo("teacher", "admin"),
  getStudentsBySubject
);


// ================= CREATE MARKS =================
// Teacher enters marks
router.post(
  "/",
  protect,
  restrictTo("teacher", "admin"),
  createMarks
);


// ================= GET ALL MARKS =================
router.get(
  "/",
  protect,
  getAllMarks
);


// ================= DELETE MARK =================
router.delete(
  "/:id",
  protect,
  restrictTo("admin"),
  deleteMarks
);

module.exports = router;