const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/auth.middleware");

const roleMiddleware = require("../middleware/role.middleware");

router.get(
  "/employee",
  authMiddleware,
  roleMiddleware("EMPLOYEE"),
  (req, res) => {

    res.json({
      success: true,
      message: "Welcome Employee",
      user: req.user,
    });
  }
);

router.get(
  "/manager",
  authMiddleware,
  roleMiddleware("MANAGER"),
  (req, res) => {

    res.json({
      success: true,
      message: "Welcome Manager",
      user: req.user,
    });
  }
);

router.get(
  "/admin",
  authMiddleware,
  roleMiddleware("ADMIN"),
  (req, res) => {

    res.json({
      success: true,
      message: "Welcome Admin",
      user: req.user,
    });
  }
);

module.exports = router;