import "dotenv/config";
import express, { type Request, type Response } from "express";
import path from "path";
import env from "./config/env.config.js";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { asyncHandler } from "./middlewares/asyncHandler.middleware.js";
import { httpStatus } from "./config/Https.config.js";
import DatabaseConnect from "./config/database.config.js";
import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import errorHandler from "./middlewares/errorHandler.middleware.js";

const app = express();

const BASE_PATH = env.BASE_PATH;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(helmet());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.get(
  "/health-check",
  asyncHandler(async (_req: Request, res: Response) => {
    const date = new Date();

    res.status(httpStatus.OK).json({
      message: "Server is running successfully",
      date,
    });
  })
);

app.use(`${BASE_PATH}/auth`, authRouter);
app.use(`${BASE_PATH}/user`, userRouter);

app.use(errorHandler);

const initializeApp = async () => {
  try {
    await DatabaseConnect();
    console.log(`Database connected in ${env.NODE_ENV} mode`);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

const port = env.PORT;

app.listen(port, async () => {
  await initializeApp();
  console.log(`Server is running on port ${port} in ${env.NODE_ENV} mode`);
});
