const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:3000","http://localhost:5173","http://localhost:5174" ],
    credentials: true,
  })
);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/marks",require("./routes/marks"));
app.use("/api/student-performance", require("./routes/studentPerformance"));
app.use("/api/subjects", require("./routes/subject"));
app.use("/api/analytics", require("./routes/analytics"));
app.use("/api/students", require("./routes/student"));
app.use("/api/teachers", require("./routes/teacher"));
app.get("/", (req, res) => {
  res.json({ message: "API Running Successfully 🚀" });
})

// Global Error Handler (must be last)
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

module.exports = app;
