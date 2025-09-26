import express, { Request, Response } from "express";
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("EkklesiaHub Backend is running 🚀");
});

app.get("/", (req: Request, res: Response) => {
  res.json({ message: "EkklesiaHub Backend is now running 🚀" });
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
