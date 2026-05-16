import { prisma } from "../db/prisma";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/token";

const USER_PUBLIC_SELECT = {
  id: true,
  firstName: true,
  lastName: true,
  username: true,
  email: true,
  bio: true,
  profileImg: true,
  bannerImg: true,
  createdAt: true,
  updatedAt: true,
};

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  username?: string,
) => {
  const existing = await prisma.user.findFirst({
    where: { OR: [{ email }, ...(username ? [{ username }] : [])] },
  });
  if (existing) throw new Error("User already exists");

  const hashedPassword = await hashPassword(password);
  const resolvedUsername = username || email.split("@")[0];

  const user = await prisma.user.create({
    data: {
      firstName,
      lastName,
      username: resolvedUsername,
      email,
      password: hashedPassword,
    },
    select: USER_PUBLIC_SELECT,
  });
  const token = generateToken(user.id);
  return { user, token };
};

export const login = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("User not found");
  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) throw new Error("Invalid credentials");
  const token = generateToken(user.id);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};

export const findUserById = async (id: string) => {
  return prisma.user.findUnique({ where: { id }, select: USER_PUBLIC_SELECT });
};

export const updateUserProfile = async (
  id: string,
  data: {
    firstName?: string;
    lastName?: string;
    bio?: string;
    profileImg?: string;
    bannerImg?: string;
    username?: string;
  },
) => {
  if (data.username) {
    const trimmed = data.username.trim().toLowerCase();

    if (!/^[a-z0-9_-]{3,30}$/.test(trimmed)) {
      throw new Error(
        "Username must be 3–30 characters and can only contain letters, numbers, _ and -",
      );
    }

    const existing = await prisma.user.findUnique({
      where: { username: trimmed },
    });

    if (existing && existing.id !== id) {
      throw new Error("That username is already taken. Please choose another.");
    }

    data.username = trimmed;
  }

  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      bio: true,
      profileImg: true,
      bannerImg: true,
      createdAt: true,
      updatedAt: true,
    },
  });
};

export const changeUserPassword = async (
  id: string,
  currentPassword: string,
  newPassword: string,
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  const valid = await comparePassword(currentPassword, user.password);
  if (!valid) throw new Error("Current password is incorrect");

  const hashed = await hashPassword(newPassword);
  await prisma.user.update({ where: { id }, data: { password: hashed } });
  return { message: "Password updated successfully" };
};

export const changeUserEmail = async (
  id: string,
  newEmail: string,
  password: string,
) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Password is incorrect");

  const taken = await prisma.user.findFirst({
    where: { email: newEmail, NOT: { id } },
  });
  if (taken) throw new Error("Email is already in use");

  return prisma.user.update({
    where: { id },
    data: { email: newEmail },
    select: { id: true, email: true },
  });
};

export const deleteUserAccount = async (id: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new Error("User not found");

  const valid = await comparePassword(password, user.password);
  if (!valid) throw new Error("Password is incorrect");

  await prisma.user.delete({ where: { id } });
  return { message: "Account deleted" };
};
