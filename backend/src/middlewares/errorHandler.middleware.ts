import type { ErrorRequestHandler } from "express";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";
import { ZodError } from "zod";
import { httpStatus } from "../config/Https.config.js";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ZodError) {
    const formattedErrors = err.issues.map((error) => ({
      field: error.path.join("."),
      message: error.message,
    }));
    res.status(httpStatus.BAD_REQUEST).json({
      success: false,
      message: "Validation Error",
      data: null,
      error: {
        code: ErrorCodeEnum.VALIDATION_ERROR,
        details: formattedErrors,
      },
    });
    return;
  }

  // Handle MongoDB Duplicate Key Error
  if ("code" in err && err.code === 11000) {
    const keyValue = (err as { keyValue: Record<string, unknown> }).keyValue;
    const field = Object.keys(keyValue)[0];

    // Map field to specific error code
    const errorCodeMap: Record<string, string> = {
      email: ErrorCodeEnum.AUTH_EMAIL_ALREADY_EXISTS,
      phone: ErrorCodeEnum.AUTH_PHONE_ALREADY_EXISTS,
    };

    const errorCode =
      errorCodeMap[field ?? ""] ?? ErrorCodeEnum.DUPLICATE_FIELD;

    res.status(httpStatus.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
      data: null,
      error: {
        code: errorCode,
        field,
      },
    });
    return;
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  const errorCode =
    (err as any).errorCode || ErrorCodeEnum.INTERNAL_SERVER_ERROR;

  res.status(statusCode).json({
    success: false,
    message,
    data: null,
    error: {
      code: errorCode,
    },
  });
  return;
};

export default errorHandler;
