const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const goalSheetRoutes = require("./routes/goalSheet.routes");
const goalRoutes = require("./routes/goal.routes");
const quarterlyRoutes = require("./routes/quarterly.routes");

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan("dev"));

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/goal-sheets", goalSheetRoutes);
app.use("/api/goals", goalRoutes);
app.use("/api/quarterly-updates", quarterlyRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Goal Tracking Portal API Running"
  });
});

module.exports = app;