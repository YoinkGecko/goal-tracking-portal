const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require("../middleware/role.middleware");

const goalSheetController = require("../controllers/goalSheet.controller");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  goalSheetController.createGoalSheet,
);

router.post(
  "/:id/submit",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  goalSheetController.submitGoalSheet,
);

module.exports = router;
