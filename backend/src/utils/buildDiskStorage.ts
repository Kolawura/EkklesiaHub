import multer, { StorageEngine } from "multer";
import path from "path";
import fs from "fs";

// Map the (declared) MIME type to a fixed, safe extension. We deliberately
// do NOT use `file.originalname`'s extension — it's attacker-controlled
// multipart form data, independent of `file.mimetype` (also attacker-
// controlled, but at least constrained to this allowlist by fileFilter in
// upload.ts). Previously, an upload named e.g. "evil.svg" or "evil.html"
// with a spoofed Content-Type of image/png would pass fileFilter and then
// be written to disk WITH the .svg/.html extension — which express.static
// then served back with a script-executing Content-Type, from the app's
// own origin. Forcing the extension here means everything written to
// /uploads is always served as a genuine image/* type; combined with
// helmet()'s default `X-Content-Type-Options: nosniff`, browsers won't
// reinterpret the bytes as HTML/script even if they aren't a real image.
const EXTENSION_BY_MIME: Record<string, string> = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

export function buildDiskStorage(): StorageEngine {
  const uploadDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      // Should always hit a known key — fileFilter already rejects
      // anything outside EXTENSION_BY_MIME's keys — but never fall back
      // to an attacker-suppliable extension if this ever runs first.
      const ext = EXTENSION_BY_MIME[file.mimetype] ?? ".bin";
      cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
  });
}
