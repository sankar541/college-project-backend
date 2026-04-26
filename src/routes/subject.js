const express = require("express");
const router = express.Router();

const {
  createSubject,
  getAllSubjects
} = require("../controllers/Subject");

const { protect, restrictTo } = require("../middleware/jwt");

// only admin can create subjects
router.post("/", protect, restrictTo("admin"), createSubject);

// everyone logged in can see subjects
router.get("/", protect, getAllSubjects);

module.exports = router;
