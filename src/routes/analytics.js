const express = require("express");
const router = express.Router();

const { getBranchAnalytics, getOverviewStats, getTeacherStats, getStudentStats, getTeacherAnalysis, getTeacherPerformanceCharts } = require("../controllers/analytics");
const { protect, restrictTo } = require("../middleware/jwt");

router.get("/overview", protect, restrictTo("admin"), getOverviewStats);
router.get("/teacher-stats", protect, restrictTo("teacher"), getTeacherStats);
router.get("/teacher-analysis", protect, restrictTo("teacher"), getTeacherAnalysis);
router.get("/teacher-performance/:branch", protect, restrictTo("teacher"), getTeacherPerformanceCharts);
router.get("/student-stats", protect, restrictTo("student"), getStudentStats);
router.get("/branch/:branch", protect, getBranchAnalytics);

module.exports = router;