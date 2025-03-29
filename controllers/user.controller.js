const { sendErrorResponse, sendSuccessResponse } = require("../helpers/response");
const createError = require("http-errors");
const {User} = require("../models");
   
const getUser = async (req, res, next) => {
    try {
        const userId = req?.payload?.aud;

        if(!userId){
            console.log("userId not found!");
            throw createError.Unauthorized("Something went wrong!");
        }
        console.log(">>>> req.payload userId", userId);

        const user = await User.findOne({
          where: { id: userId },
        });
   
        const userData = {id: user.id, name: user.name, email: user.email};
        return sendSuccessResponse(res, "User retrieved successfully", userData);
      } catch (error) {
        if (error.isJoi === true) {
          const err_message = error.message.replace(/['"]/g, "");
          return sendErrorResponse(res, err_message, 422);
        } else {
          return sendErrorResponse(res, error.message);
        }
      }   
  }

  module.exports = {getUser}