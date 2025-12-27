import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import type { Request, Response } from "express";
import {
  userRegisterValidation,
  userLoginValidation,
} from "../validators/user.validator.js";

import { httpStatus } from "../config/Https.config.js";
import {
  loginUserService,
  registerUserService,
  refreshTokenService,
} from "../services/auth.service.js";

export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const requestBody = userRegisterValidation.parse(req.body);

    const response = await registerUserService(requestBody);

    res.status(httpStatus.CREATED).json({
      success: true,
      message: response.message,
      data: {
        user: response.user,
      },
    });
  }
);

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const requestBody = userLoginValidation.parse(req.body);

  const response = await loginUserService(requestBody);

  res.status(httpStatus.OK).json({
    success: true,
    message: response.message,
    data: {
      user: response.user,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
    },
  });
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const response = await refreshTokenService(refreshToken);

    res.status(httpStatus.OK).json({
      success: true,
      message: response.message,
      data: {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      },
    });
  }
);
