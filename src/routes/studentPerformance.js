const express = require("express");
const router = express.Router();

const { protect, restrictTo } = require("../middleware/jwt");
const { getStudentPerformance } = require("../controllers/studentPerformance");

router.get("/:registrationNumber", protect, restrictTo("student", "teacher", "admin"), getStudentPerformance);

module.exports = router;