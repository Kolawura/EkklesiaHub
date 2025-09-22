import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("EkklesiaHub Backend is running 🚀");
});

app.listen(PORT, () => console.log(`server running on port ${PORT}`));
