const express = require("express");
const { verifyAccessToken } = require("../helpers/jwt-helper");
const router = express.Router();
router.get("/", async (req, res, next) => {
 res.send("Welcome to API route");
});
router.post("/some-api-endpoint", verifyAccessToken, async (req, res, next) => {
 res.send("API route");
});
module.exports = router;
