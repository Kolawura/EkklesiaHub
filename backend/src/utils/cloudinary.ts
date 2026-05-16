import { StorageEngine } from "multer";

export function buildCloudinaryStorage(): StorageEngine | null {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return null;
  }

  const cloudinary = require("cloudinary").v2;
  const { CloudinaryStorage } = require("multer-storage-cloudinary");

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  return new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "ekklesiahub",
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 1200, crop: "limit", quality: "auto" }],
    },
  });
}
