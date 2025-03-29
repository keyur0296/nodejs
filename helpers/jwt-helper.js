const JWT = require("jsonwebtoken");
const createError = require("http-errors");
require("dotenv").config();

const signAccessToken = (user_id) => {
   //creting a token here
   return new Promise((resolve, reject) => {
     const payload = {};
     const secret = process.env.ACCESS_TOKEN_SECRET;
     const options = {
      //  expiresIn: "60s",
      expiresIn: "1d",
       //issuer: "www.example.com",
       audience: user_id,
     };
     JWT.sign(payload, secret, options, (err, token) => {
       //if (err) reject(err);
       if (err) {
         reject(createError.InternalServerError());
       }
       resolve(token);
     });
   });
 }

const verifyAccessToken = (req, res, next) => {
   if (!req.headers["authorization"]) return next(createError.Unauthorized());
   const authHeader = req.headers["authorization"];
   const bearerToken = authHeader.split(" ");
   const token = bearerToken[1];

   JWT.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
     if (err) {
       return next(createError.Unauthorized());
     }
     req.payload = payload;
     next();
   });
 }

 const signRefreshToken = (user_id) => {
   //creting a token here
   return new Promise((resolve, reject) => {
     const payload = {};
     const secret = process.env.REFRESH_TOKEN_SECRET;
     const options = {
       expiresIn: "1y", //1 year
       //issuer: "www.example.com",
       audience: user_id,
     };

     JWT.sign(payload, secret, options, (err, token) => {
       //if (err) reject(err);
       if (err) {
         reject(createError.InternalServerError());
       }
       resolve(token);
     });
   });
 }

 const verifyRefreshToken = (refreshToken) => {
   return new Promise((resolve, reject) => {
     JWT.verify(
       refreshToken,
       process.env.REFRESH_TOKEN_SECRET,
       (err, payload) => {
         if (err) return reject(createError.Unauthorized());
         const userId = payload.aud;

         resolve(userId);
       }
     );
   });
 }

 module.exports = {signAccessToken, verifyAccessToken, verifyRefreshToken, signRefreshToken}