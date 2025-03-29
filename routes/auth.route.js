const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");

// router.get("/index", authController.index);
router.post("/signup", authController.signUp);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

module.exports = router;
