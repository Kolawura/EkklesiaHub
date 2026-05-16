import jwt from "jsonwebtoken";

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return secret;
};

export const TOKEN_EXPIRY = "7h";

export const generateToken = (userId: string) => {
  return jwt.sign({ userId }, getJwtSecret(), { expiresIn: TOKEN_EXPIRY });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, getJwtSecret());
};
