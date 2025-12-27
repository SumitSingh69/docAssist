import env from "../config/env.config.js";
import User from "../models/user.model.js";
import {
  BadRequestException,
  UnauthorizedException,
} from "../utils/AppError.js";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";
import type {
  UserLoginType,
  UserRegisterType,
} from "../validators/user.validator.js";
import jwt from "jsonwebtoken";

export const registerUserService = async (userData: UserRegisterType) => {
  const { name, email, password, role, phone } = userData;

  const existed = await User.findOne({ email });

  if (existed) {
    throw new BadRequestException("User with this email already exists");
  }

  const newUser = new User({
    name,
    email,
    password,
    role,
    phone,
  });

  await newUser.save();

  const userObj = newUser.omitPassword();

  return {
    user: userObj,
    message: "User created successfully",
  };
};

export const loginUserService = async (userData: UserLoginType) => {
  const { email, password } = userData;

  const existedUser = await User.findOne({ email });

  if (!existedUser) {
    throw new BadRequestException("User not found");
  }

  const isPasswordMatched = await existedUser.comparePassword(password);

  if (!isPasswordMatched) {
    throw new BadRequestException("Invalid credentials");
  }

  const token = jwt.sign(
    {
      id: existedUser._id,
      role: existedUser.role,
    },
    env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions
  );

  const refreshToken = existedUser.generateRefreshToken();

  await existedUser.save();

  const userObj = existedUser.omitPassword();

  return {
    user: userObj,
    accessToken: token,
    refreshToken,
    message: "User logged in successfully",
  };
};

export const refreshTokenService = async (refreshToken: string) => {
  if (!refreshToken) {
    throw new UnauthorizedException(
      "Refresh token is required",
      ErrorCodeEnum.AUTH_TOKEN_NOT_FOUND
    );
  }

  // Find user with this refresh token
  const user = await User.findOne({ refreshToken });

  if (!user) {
    throw new UnauthorizedException(
      "Invalid refresh token",
      ErrorCodeEnum.AUTH_INVALID_TOKEN
    );
  }

  // Check if refresh token has expired
  if (user.refreshTokenExpiresAt && user.refreshTokenExpiresAt < new Date()) {
    // Clear expired refresh token
    (user as any).refreshToken = undefined;
    (user as any).refreshTokenExpiresAt = undefined;
    await user.save();

    throw new UnauthorizedException(
      "Refresh token has expired",
      ErrorCodeEnum.AUTH_TOKEN_EXPIRED
    );
  }

  // Generate new access token
  const accessToken = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    env.JWT_SECRET as jwt.Secret,
    {
      expiresIn: env.JWT_EXPIRES_IN,
    } as jwt.SignOptions
  );

  // Generate new refresh token
  const newRefreshToken = user.generateRefreshToken();
  await user.save();

  return {
    accessToken,
    refreshToken: newRefreshToken,
    message: "Token refreshed successfully",
  };
};
