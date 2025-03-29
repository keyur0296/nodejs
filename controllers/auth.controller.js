const { sendErrorResponse, sendSuccessResponse } = require("../helpers/response");
const { authSchema, loginSchema } = require("../schemas/auth-schema");
const bcrypt = require("bcrypt");
const createError = require("http-errors");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
   } = require("../helpers/jwt-helper");
const {User} = require("../models");
   
const signUp = async (req, res, next) => {
    try {
        const data = await authSchema.validateAsync(req.body);
   
        const doExist = await User.findOne({
          where: { email: data.email },
        });
   
        if (doExist)
          throw createError.Conflict(`${data.email} is already been registered`);
   
        data.password = bcrypt.hashSync(
          data.password,
          bcrypt.genSaltSync(8),
          null
        );
   
        const user = new User(data);
        const saveUser = await user.save();
   
        const accessToken = await signAccessToken(saveUser.id.toString());
        const refreshToken = await signRefreshToken(saveUser.id.toString());
        const userData = {id: user.id, name: user.name, email: user.email};

        const dataArray = {};
   
        //dataArray.data = saveUser;
        dataArray.accessToken = accessToken;
        dataArray.refreshToken = refreshToken;
        dataArray.user = userData;
        
        return sendSuccessResponse(res, "User inserted successfully", dataArray);
      } catch (error) {
        if (error.isJoi === true) {
          const err_message = error.message.replace(/['"]/g, "");
          return sendErrorResponse(res, err_message, 422);
        } else {
          return sendErrorResponse(res, error.message);
        }
      }   
  }

  const login = async (req, res) =>{
    try {
        const data = await loginSchema.validateAsync(req.body);
        const user = await User.findOne({
          where: {
            email: data.email,
          },
        });
   
        if (!user) throw createError.NotFound("User not register");
   
        const isMatch = await bcrypt.compare(data.password, user.password);
   
        if (!isMatch)
          throw createError.Unauthorized("Usermame and Password Invalid");

        const accessToken = await signAccessToken(user.id.toString());
        const refreshToken = await signRefreshToken(user.id.toString());
        const userData = {id: user.id, name: user.name, email: user.email};

        const dataArray = {};
        dataArray.accessToken = accessToken;
        dataArray.refreshToken = refreshToken;
        dataArray.user = userData;

        /*res.cookie("accessToken", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production", // Use secure cookies in production
          sameSite: "Strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 day
        });*/

        return sendSuccessResponse(res, "Login successfully", dataArray);
      } catch (error) {
        //next(error);
        if (error.isJoi === true) {
          const err_message = error.message.replace(/['"]/g, "");
          return sendErrorResponse(res, err_message, 422);
        }
        return sendErrorResponse(res, error.message);
      }
   
  }

  const refreshToken = async (req, res, next) => {
    try {
      const { refreshToken } = req.body;
 
      if (!refreshToken) {
        throw createError.NotFound("Refresh Token not found");
      }
 
      const userId = await verifyRefreshToken(refreshToken);
      const newAccessToken = await signAccessToken(userId);
      const newRefreshTOken = await signRefreshToken(userId);
 
      //res.send({ accessToken: newAccessToken, newRefreshTOken });
 
      const data = { accessToken: newAccessToken, newRefreshTOken };
      sendSuccessResponse(res, "sucess", data);
 
    } catch (error) {
      return sendErrorResponse(res, error.message);
    }
  }
 
 
 
  module.exports = {signUp, login, refreshToken}