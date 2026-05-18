const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require("../middleware/role.middleware");

const reportController =
  require("../controllers/report.controller");

router.get(
  "/achievement",
  authMiddleware,
  roleMiddleware("ADMIN", "MANAGER"),
  reportController.getAchievementReport
);

module.exports = router;