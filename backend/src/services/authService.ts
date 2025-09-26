import bcrypt from "bcryptjs";
import { prisma } from "../db/prisma";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/generateToken";

export const register = async (
  username: string,
  email: string,
  password: string
) => {
  const hashedPassword = await hashPassword(password);
  const user = await prisma.user.create({
    data: { username, email, password: hashedPassword },
  });
  const token = generateToken(user.id);
  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");
  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) throw new Error("Invalid credentials");
  const token = generateToken(user.id);
  return { user, token };
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};
