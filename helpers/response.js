const sendSuccessResponse = (res, message = "Success", data = []) => {
    return res.status(200).send({
      status: true,
      message: message,
      data: data,
    });
   };
   
   const sendErrorResponse =  (res, message = "Fail", statusCode = 400) => {
    return res.status(statusCode).send({
      status: false,
      message: message,
    });
   };
   
   module.exports = { sendSuccessResponse, sendErrorResponse };
   