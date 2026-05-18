const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require("../middleware/role.middleware");

const quarterlyController = require("../controllers/quarterly.controller");

router.post(
  "/:goalId",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  quarterlyController.createQuarterlyUpdate
);

router.post(
  "/:id/comment",
  authMiddleware,
  roleMiddleware("MANAGER"),
  quarterlyController.addManagerComment
);

module.exports = router;