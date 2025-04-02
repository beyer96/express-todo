import { Request, Response, NextFunction } from "express";
import { getErrorMessage } from "../utils";
import config from "../config";
import CustomError from "../errors/CustomError";
import ValidationError from "../errors/ValidationError";
import { CustomErrorResponse } from "../types/errors";

// Based on https://www.youtube.com/watch?v=EUYnERcOGpA
export default function errorHandler(
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent || config.debug) {
    next(error);
    return;
  }

  if (error instanceof CustomError) {
    const responseObject: CustomErrorResponse = {
      error: {
        message: error.message,
        statusCode: error.statusCode
      }
    }

    if (error instanceof ValidationError) {
      responseObject.error["validationErrors"] = error.validationErrors;
    }

    res.status(error.statusCode).json(responseObject);
    return;
  }

  res.status(500).json({
    error: {
      message: getErrorMessage(error) || "An error occurred. Please view logs for more details."
    }
  })
}
