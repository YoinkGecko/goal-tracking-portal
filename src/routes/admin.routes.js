const express = require("express");

const router = express.Router();

const adminController =
  require("../controllers/admin.controller");

const authMiddleware =
  require("../middleware/auth.middleware");

const roleMiddleware =
  require("../middleware/role.middleware");

router.get(
  "/dashboard",
  authMiddleware,
  roleMiddleware("ADMIN"),
  adminController.getDashboardData
);

module.exports = router;