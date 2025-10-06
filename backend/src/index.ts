import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
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
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cookieParser());
app.use(helmet());
app.use(generalLimiter);

app.get("/", (req: Request, res: Response) => {
  res.send("EkklesiaHub Backend is running 🚀");
});

app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/bookmarks", bookmarkRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/reactions", reactionRoutes);
app.use("/api/tags", tagRoutes);

process.on("SIGINT", async () => {
  console.log("🧹 Closing Prisma connection...");
  await prisma.$disconnect();
  process.exit(0);
});

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "EkklesiaHub Backend is now running 🚀" });
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
