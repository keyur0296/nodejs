const express = require("express");
const { verifyAccessToken } = require("../helpers/jwt-helper");
const router = express.Router();
const { userController } = require("../controllers");

router.get("/get-user", verifyAccessToken, userController.getUser);

module.exports = router;
