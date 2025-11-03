import { prisma } from "../db/prisma";
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { generateToken } from "../utils/token";

export const register = async (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
  username?: string
) => {
  const existingUser = await prisma.user.findFirst({
    where: { OR: [{ email }, { username }] },
  });
  if (existingUser) throw new Error("User already exists");

  const hashedPassword = await hashPassword(password);
  if (!username) {
    username = email.split("@")[0];
  }
  const user = await prisma.user.create({
    data: { firstName, lastName, username, email, password: hashedPassword },
  });
  const token = generateToken(user.id);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const login = async (email: string, password: string) => {
  const user = await findUserByEmail(email);
  if (!user) throw new Error("User not found");
  const passwordMatch = await comparePassword(password, user.password);
  if (!passwordMatch) throw new Error("Invalid credentials");
  const token = generateToken(user.id);
  const { password: _, ...userWithoutPassword } = user;
  return { user: userWithoutPassword, token };
};

export const findUserById = async (id: string) => {
  const user = await prisma.user.findFirst({
    where: { id },
    select: {
      id: true,
      firstName: true,
      lastName: true,
      username: true,
      email: true,
      bio: true,
      profileImg: true,
      bannerImg: true,
      posts: true,
      comments: true,
      reactions: true,
      memberships: true,
      followers: true,
      following: true,
      bookmarks: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return user;
};

export const findUserByEmail = async (email: string) => {
  return prisma.user.findUnique({ where: { email } });
};
