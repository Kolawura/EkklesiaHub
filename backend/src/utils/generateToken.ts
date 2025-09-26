import jwt from "jsonwebtoken";

export const generateToken = (userId: string) => {
  const secret = process.env.JWT_SECRET || "your_jwt_secret";
  const token = jwt.sign({ userId }, secret, { expiresIn: "1h" });
  return token;
};
