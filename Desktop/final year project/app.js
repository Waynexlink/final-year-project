const express = require("express");
const globalErrorHandler = require("./controller/error");
const AppError = require("./utils/appError");
const app = express();
//registering routes
const authRoute = require("./routes/auth");
//routes
app.use("/api/v1/auth", authRoute);
//global error handler
app.use(globalErrorHandler);
module.exports = app;
