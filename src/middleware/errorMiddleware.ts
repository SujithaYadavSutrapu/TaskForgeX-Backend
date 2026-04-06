import { ErrorRequestHandler } from "express";
import { AppError } from "../utils/appError";    

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error("ERROR :", {
    message: err.message,
    stack: err.stack,
    name: err.name,
  });

  let statusCode = 500;
  let message = "Internal Server Error";

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  }

  else if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  else if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  res.status(statusCode).json({
    statusCode,
    success: false,
    message,
  });
};