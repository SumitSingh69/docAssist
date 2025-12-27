import { asyncHandler } from "../middlewares/asyncHandler.middleware.js";
import { type Request, type Response } from "express";
import { httpStatus } from "../config/Https.config.js";
import {
  getCurrentUserService,
  updateUserService,
} from "../services/user.service.js";
import { updateUserValidation } from "../validators/user.validator.js";

export const getCurrentUser = asyncHandler(
  async (req: Request, res: Response) => {
    const response = await getCurrentUserService(req.user!);

    res.status(httpStatus.OK).json({
      success: true,
      message: "User fetched successfully",
      data: response,
      error: null,
    });
  }
);

export const updateUserProfile = asyncHandler(
  async (req: Request, res: Response) => {
    const validatedData = updateUserValidation.parse(req.body);

    const updateData = {
      ...validatedData,
      ...(req.file && {
        image: `${req.protocol}://${req.get("host")}/uploads/${
          req.file.filename
        }`,
      }),
    };

    const response = await updateUserService(
      req.user!._id.toString(),
      updateData as Parameters<typeof updateUserService>[1]
    );

    res.status(httpStatus.OK).json({
      success: true,
      message: "User updated successfully",
      data: response,
      error: null,
    });
  }
);
