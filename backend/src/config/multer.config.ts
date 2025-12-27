import multer from "multer";
import path from "path";
import { BadRequestException } from "../utils/AppError.js";
import { ErrorCodeEnum } from "../enums/error-code.enum.js";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/");
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

const imageFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new BadRequestException(
        "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        ErrorCodeEnum.FILE_UPLOAD_ERROR
      )
    );
  }
};

export const uploadProfileImage = multer({
  storage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
}).single("image");

export const uploadMultiple = (fieldName: string, maxCount: number) =>
  multer({
    storage,
    fileFilter: imageFilter,
    limits: {
      fileSize: 5 * 1024 * 1024,
    },
  }).array(fieldName, maxCount);
