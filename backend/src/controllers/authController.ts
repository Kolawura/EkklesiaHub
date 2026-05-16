import { Response } from "express";
import { loginSchema, registerSchema } from "../schema/authSchema";
import { AuthRequest } from "../utils/Type";
import {
  login,
  register,
  findUserById,
  updateUserProfile,
  changeUserPassword,
  changeUserEmail,
  deleteUserAccount,
} from "../services/authService";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 7 * 60 * 60 * 1000,
};

export const registerUser = async (req: AuthRequest, res: Response) => {
  const validated = registerSchema.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid inputs",
      error: validated.error.issues,
    });
  }
  try {
    const { firstName, lastName, email, password } = validated.data;
    const { user, token } = await register(
      firstName,
      lastName,
      email,
      password,
    );
    res.cookie("token", token, COOKIE_OPTIONS);
    return res
      .status(201)
      .json({ success: true, message: "Registration successful", data: user });
  } catch (error: any) {
    if (error.message === "User already exists") {
      return res.status(409).json({ success: false, message: error.message });
    }
    return res
      .status(500)
      .json({ success: false, message: "Registration failed" });
  }
};

export const loginUser = async (req: AuthRequest, res: Response) => {
  const validated = loginSchema.safeParse(req.body);
  if (!validated.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid inputs",
      error: validated.error.issues,
    });
  }
  try {
    const { email, password } = validated.data;
    const { user, token } = await login(email, password);
    res.cookie("token", token, COOKIE_OPTIONS);
    return res
      .status(200)
      .json({ success: true, message: "Login successful", data: user });
  } catch (error: any) {
    if (
      error.message === "User not found" ||
      error.message === "Invalid credentials"
    ) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid email or password" });
    }
    return res.status(500).json({ success: false, message: "Login failed" });
  }
};

export const logoutUser = async (_req: AuthRequest, res: Response) => {
  res.clearCookie("token", COOKIE_OPTIONS);
  return res.status(200).json({ success: true, message: "Logout successful" });
};

export const getCurrentUser = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const user = await findUserById(userId);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch user" });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { firstName, lastName, bio, profileImg, bannerImg, username } =
      req.body;

    const updated = await updateUserProfile(userId, {
      firstName,
      lastName,
      bio,
      profileImg,
      bannerImg,
      username,
    });

    return res
      .status(200)
      .json({ success: true, message: "Profile updated", data: updated });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword)
      return res
        .status(400)
        .json({ success: false, message: "Both passwords are required" });
    if (newPassword.length < 8)
      return res.status(400).json({
        success: false,
        message: "New password must be at least 8 characters",
      });

    const result = await changeUserPassword(
      userId,
      currentPassword,
      newPassword,
    );
    return res.status(200).json({ success: true, message: result.message });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const changeEmail = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    const { newEmail, password } = req.body;
    if (!newEmail || !password)
      return res
        .status(400)
        .json({ success: false, message: "Email and password are required" });

    const result = await changeUserEmail(userId, newEmail, password);
    return res
      .status(200)
      .json({ success: true, message: "Email updated", data: result });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAccount = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId!;
    // Password may come from body (DELETE with body) or body
    const password = req.body?.password;
    if (!password)
      return res.status(400).json({
        success: false,
        message: "Password is required to delete account",
      });

    await deleteUserAccount(userId, password);
    const COOKIE_OPTIONS_LOCAL = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    };
    res.clearCookie("token", COOKIE_OPTIONS_LOCAL);
    return res.status(200).json({ success: true, message: "Account deleted" });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
