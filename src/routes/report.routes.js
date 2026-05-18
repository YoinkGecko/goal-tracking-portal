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

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN", "MANAGER"),
  reportController.getCompletionDashboard
);

router.get(
  "/export/csv",
  authMiddleware,
  roleMiddleware("ADMIN"),
  reportController.exportDetailedReportCSV
);

router.get(
  "/export/audit",
  authMiddleware,
  roleMiddleware("ADMIN"),
  reportController.exportAuditLogsCSV
);

module.exports = router;