import { StorageEngine } from "multer";
import { v2 as cloudinary } from "cloudinary";

export function buildCloudinaryStorage(): StorageEngine | null {
  const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } =
    process.env;

  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
    return null;
  }

  cloudinary.config({
    cloud_name: CLOUDINARY_CLOUD_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
    secure: true,
  });

  return {
    _handleFile(req, file, cb) {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "ekklesiahub",
          resource_type: "image",
          allowed_formats: ["jpg", "jpeg", "png", "webp", "gif"],
          transformation: [
            {
              width: 1200,
              crop: "limit",
              quality: "auto",
            },
          ],
        },
        (error, result) => {
          if (error) {
            return cb(error);
          }

          if (!result) {
            return cb(new Error("Cloudinary upload returned no result"));
          }

          cb(null, {
            path: result.secure_url,
            filename: result.public_id,
            size: result.bytes,
            mimetype: file.mimetype,
          });
        },
      );

      file.stream.pipe(uploadStream);
    },

    _removeFile(req, file, cb) {
      const publicId = (file as any).filename;

      if (!publicId) {
        return cb(null);
      }

      cloudinary.uploader.destroy(publicId, (error: Error | undefined) => {
        cb(error ?? null);
      });
    },
  };
}
