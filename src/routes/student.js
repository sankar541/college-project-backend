const express = require("express");
const router = express.Router();

const { createStudents, getAllStudents, promoteStudent } = require("../controllers/student");
const { protect, restrictTo } = require("../middleware/jwt");

router.post("/", protect, restrictTo("admin"), createStudents);
router.get("/", protect, restrictTo("admin"), getAllStudents);
router.put("/:id/promote", protect, restrictTo("admin"), promoteStudent);

module.exports = router;