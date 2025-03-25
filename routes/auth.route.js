const express = require("express");
const router = express.Router();
const { authController } = require("../controllers");
const { verifyAccessToken } = require("../helpers/jwt-helper");

// router.get("/index", authController.index);
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/refresh-token", authController.refreshToken);

router.get("/", verifyAccessToken ,async (req, res, next) => {
    res.send("Welcome to auth route");
   });

module.exports = router;
