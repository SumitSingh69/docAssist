import express from "express";
import {
  loginUser,
  registerUser,
  refreshToken,
} from "../controllers/auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", registerUser);
authRouter.post("/login", loginUser);
authRouter.post("/refresh", refreshToken);

export default authRouter;
