const express = require("express");
const morgan = require("morgan");
const createError = require("http-errors");
const bodyParser = require("body-parser");
const cors = require('cors');
require("dotenv").config();

const AuthRoute = require("./routes/auth.route");
const ApiRoute = require("./routes/api.route");
const { sendErrorResponse } = require("./helpers/response");

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());//used to get request data(payload) from react
//app.use(bodyParser.json());


app.get("/", async (req, res, next) => {
 res.send("Hello Word");
});
app.use("/api/auth", AuthRoute);
app.use("/api", ApiRoute);
app.use(async (req, res, next) => {
 //NOTE: used to catch all routes if any route does not exist this functoin call autometically


 /* const error = new Error("Not Found");
 error.status = 404;
 next(error); */
 // next(createError.NotFound); //used for only return error and status code
 //next(createError.NotFound()); //used for return error and status with message code
next(createError.NotFound("This route does not exist")); //with modify message
//NOTE: whenever our application use next(parameter) first parameter below function is called
});
app.use((err, req, res, next) => {
 //NOTE: its take 4 parameter & use for error handler
 const statusCode = err.status || 500;
 /* res.status(statusCode);
 res.send({
   error: {
     status: statusCode,
     message: err.message,
   },
 }); */

 return sendErrorResponse(res, err.message, statusCode);
});

const port = process.env.PORT || 8000;
app.listen(port, () => {
 console.log(`Server running on port ${port}`);
});
