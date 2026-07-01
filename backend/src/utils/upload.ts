import multer from "multer";
import { buildCloudinaryStorage } from "./cloudinary";
import { buildDiskStorage } from "./buildDiskStorage";

const MAX_SIZE_MB = 5;

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, WebP, and GIF images are allowed"));
  }
};
//u
export const upload = multer({
  storage: buildCloudinaryStorage() ?? buildDiskStorage(),
  limits: { fileSize: MAX_SIZE_MB * 1024 * 1024 },
  fileFilter,
});

export const getFileUrl = (file: Express.Multer.File): string => {
  if ((file as any).path?.startsWith("http")) return (file as any).path;

  const base =
    process.env.APP_URL || `http://localhost:${process.env.PORT || 5000}`;
  return `${base}/uploads/${file.filename}`;
};
