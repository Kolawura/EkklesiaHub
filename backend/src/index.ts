import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import bookmarkRoutes from "./routes/bookmarkRoutes";
import commentRoutes from "./routes/commentRoutes";
import postRoutes from "./routes/postRoutes";
import reactionRoutes from "./routes/reactionRoutes";
import communityRoutes from "./routes/communityRoutes";
import followRoutes from "./routes/followRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import userRoutes from "./routes/userRoutes";
import scriptureRoutes from "./routes/scriptureRoutes";
import seriesRoutes from "./routes/seriesRoutes";
import readingListRoutes from "./routes/readingListRoutes";
import tagRoutes from "./routes/tagRoutes";
import { initBibleRoutes } from "./bible/routes";
import { prisma } from "./db/prisma";
import { Pool } from "pg";
import { authLimiter, generalLimiter } from "./middlewares/rateLimiter";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;
const biblePool = new Pool({
  connectionString: process.env.BIBLE_DATABASE_URL,
});
biblePool
  .query("SELECT COUNT(*) FROM bible_verses WHERE translation='NIV'")
  .then((r) => console.log(`✅ Bible DB: ${r.rows[0].count} NIV verses`))
  .catch((e) => console.error("❌ Bible DB failed:", e.message));

const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
];

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(generalLimiter);
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.get("/", (_req: Request, res: Response) => {
  res.json({ message: "EkklesiaHub Backend is running 🚀" });
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/series", seriesRoutes);
app.use("/api/reading-list", readingListRoutes);
app.use("/api/tags", tagRoutes); // replaces existing tagRoutes if any
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scripture", scriptureRoutes);
app.use("/api/bible", initBibleRoutes(biblePool));

// Serve locally stored uploads (no-op when using Cloudinary)
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Global error handler
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const server = app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`),
);

const shutdown = async () => {
  console.log("🧹 Closing Prisma connection...");
  await prisma.$disconnect();
  await biblePool.end();
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
