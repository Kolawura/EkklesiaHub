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
import tagRoutes from "./routes/tagRoutes";
import { prisma } from "./db/prisma";
import { authLimiter, generalLimiter } from "./middlewares/rateLimiter";
import uploadRoutes from "./routes/uploadRoutes";
import notificationRoutes from "./routes/notificationRoutes";
import userRoutes from "./routes/userRoutes";
import scriptureRoutes from "./routes/scriptureRoutes";
import path from "path";

const app = express();
const PORT = process.env.PORT || 5000;

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
app.use("/api/tags", tagRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/scripture", scriptureRoutes);

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
  server.close(() => process.exit(0));
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
