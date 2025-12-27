import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import env from "../config/env.config.js";
import { httpStatus } from "../config/Https.config.js";
import User from "../models/user.model.js";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";

export const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    const queryToken = req.query["token"] as string | undefined;

    let token: string | undefined;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    } else if (queryToken) {
      token = queryToken;
    }

    if (!token) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "No authorization token provided. Use: Bearer <token>",
        data: null,
        error: {
          code: ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND,
        },
      });
      return;
    }

    const decoded = jwt.verify(token, env.JWT_SECRET as string) as {
      id: string;
      role: string;
    };

    if (!decoded || !decoded.id) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Invalid token payload",
        data: null,
        error: {
          code: ErrorCodeEnum.AUTH_INVALID_TOKEN,
        },
      });
      return;
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "User not found",
        data: null,
        error: {
          code: ErrorCodeEnum.AUTH_USER_NOT_FOUND,
        },
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    let message = "Authentication failed";
    let errorCode: string = ErrorCodeEnum.ACCESS_UNAUTHORIZED;

    if (error instanceof jwt.TokenExpiredError) {
      message = "Token has expired";
      errorCode = ErrorCodeEnum.AUTH_TOKEN_EXPIRED;
    } else if (error instanceof jwt.JsonWebTokenError) {
      message = "Invalid token";
      errorCode = ErrorCodeEnum.AUTH_INVALID_TOKEN;
    }

    res.status(httpStatus.UNAUTHORIZED).json({
      success: false,
      message,
      data: null,
      error: {
        code: errorCode,
      },
    });
    return;
  }
};

export const verifyRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(httpStatus.UNAUTHORIZED).json({
        success: false,
        message: "Authentication required",
        data: null,
        error: {
          code: ErrorCodeEnum.ACCESS_UNAUTHORIZED,
        },
      });
      return;
    }

    const userRole = req.user.role;

    if (!allowedRoles.includes(userRole)) {
      res.status(httpStatus.FORBIDDEN).json({
        success: false,
        message: "You do not have permission to access this resource",
        data: null,
        error: {
          code: ErrorCodeEnum.AUTH_UNAUTHORIZED_ACCESS,
        },
      });
      return;
    }

    next();
  };
};
