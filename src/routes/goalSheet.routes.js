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

router.post(
  "/:id/approve",
  authMiddleware,
  roleMiddleware("MANAGER"),
  goalSheetController.approveGoalSheet
);

router.post(
  "/:id/return",
  authMiddleware,
  roleMiddleware("MANAGER"),
  goalSheetController.returnGoalSheet
);

router.post(
  "/:id/unlock",
  authMiddleware,
  roleMiddleware("ADMIN"),
  goalSheetController.unlockGoalSheet
);

router.get(
  "/",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  goalSheetController.getEmployeeGoalSheets
);

router.get(
  "/:id",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  goalSheetController.getGoalSheetById
);

module.exports = router;
