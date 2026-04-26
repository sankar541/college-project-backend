const express = require("express");
const router = express.Router();
const { getAllTeachers, createTeacher } = require("../controllers/teacher");
const { protect, restrictTo } = require("../middleware/jwt");

router.get("/", protect, restrictTo("admin"), getAllTeachers);
router.post("/", protect, restrictTo("admin"), createTeacher);

module.exports = router;
