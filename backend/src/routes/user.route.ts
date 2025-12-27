import express from "express";
import {
  getCurrentUser,
  updateUserProfile,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { uploadProfileImage } from "../config/multer.config.js";

const userRouter = express.Router();

// All routes require authentication
userRouter.use(isAuthenticated);

// Get current user profile
userRouter.get("/me", getCurrentUser);

// Update user profile (with optional image upload)
userRouter.put("/me", uploadProfileImage, updateUserProfile);

export default userRouter;
