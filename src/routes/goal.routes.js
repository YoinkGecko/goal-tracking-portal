const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require("../middleware/role.middleware");

const goalController = require("../controllers/goal.controller");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  goalController.createGoal
);

module.exports = router;