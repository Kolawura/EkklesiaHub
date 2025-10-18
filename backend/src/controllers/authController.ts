import { Request, Response } from "express";
import { findUserByEmail, login, register } from "../services/authService";
import { loginSchema, registerSchema } from "../schema/authSchema";

export const registerUser = async (req: Request, res: Response) => {
  const validateBody = registerSchema.safeParse(req.body);
  if (!validateBody.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid inputs",
      error: validateBody.error.issues,
    });
  }

  try {
    const { firstName, lastName, email, password } = validateBody.data;
    if (!email || !password)
      return res
        .status(400)
        .json({ success: true, message: "All fields are required" });
    const isRegistered = await findUserByEmail(email);
    if (isRegistered)
      return res
        .status(400)
        .json({ success: true, message: "User already registered" });
    const { user, token } = await register(
      firstName,
      lastName,
      email,
      password
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res.status(200).json({
      success: true,
      message: "User Registration Successful",
      data: user,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Registration failed", error });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const validateBody = loginSchema.safeParse(req.body);
  if (!validateBody.success) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid inputs",
        error: validateBody.error.issues,
      });
  }

  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const isUser = await findUserByEmail(email);
    if (!isUser)
      return res.status(400).json({ success: true, message: "User not found" });

    const { user, token } = await login(email, password);
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res
      .status(200)
      .json({ success: true, message: "Login Successful", data: user });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Login failed", error: err });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });
    return res
      .status(200)
      .json({ success: true, message: "Logout Successful" });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Logout failed", error: err });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;
    if (!user)
      return res.status(401).json({ success: true, message: "Unauthorized" });
    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch user", error: err });
  }
};
