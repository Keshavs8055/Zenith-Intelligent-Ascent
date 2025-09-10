import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterUserSchema, LoginSchema, Session } from "@zenith/types";
import UserModel from "../models/user.js";
import { catchAsync, sendResponse } from "../utils/globalWrapper.js";
import { generateToken } from "../utils/token.js";
import z from "zod";
import { AuthenticatedRequest } from "../middlewares/requireAuth.js";
import { AppError } from "../utils/appError.js";

// -------------------
// Controllers
// -------------------
export const UserSignUpController = catchAsync(async (req, res) => {
  const parsed = RegisterUserSchema.parse(req.body);

  const existingUser = await UserModel.findOne({ email: parsed.email });
  if (existingUser) throw new AppError("Email already in use", 400);

  const hashedPassword = await bcrypt.hash(parsed.password, 10);

  const user = new UserModel({
    name: parsed.name,
    email: parsed.email,
    password: hashedPassword,
    role: "user",
  });

  const refreshToken = generateToken(user.id, user.email, user.role, "7d");
  user.refreshToken = refreshToken;
  await user.save();
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  const token = generateToken(user.id, user.email, user.role, "1h");

  const session: Session = {
    user: {
      id: user.id,
      name: user.name || "",
      email: user.email,
      role: user.role,
    },
    token,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };

  return sendResponse(res, 201, session, "User registered successfully");
});

export const UserLoginController = catchAsync(async (req, res) => {
  const parsed = LoginSchema.parse(req.body);

  const user = await UserModel.findOne({ email: parsed.email });
  if (!user || !user.name) throw new AppError("User not found", 404);

  const isMatch = await bcrypt.compare(parsed.password, user.password);
  if (!isMatch) throw new AppError("Invalid password. Try again.", 401);

  const token = generateToken(user.id, user.email, user.role, "1h");
  const refreshToken = generateToken(user.id, user.email, user.role, "7d");

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  const session: Session = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };

  return sendResponse<Session>(res, 200, session, "Login successful");
});

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ForgotPasswordController = catchAsync(async (req, res) => {
  const { email } = ForgotPasswordSchema.parse(req.body);

  const user = await UserModel.findOne({ email });
  if (!user) throw new AppError("User not found", 404);

  const resetToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  return sendResponse(
    res,
    200,
    { resetToken },
    "Password reset token generated"
  );
});

export const RefreshTokenController = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) throw new AppError("Missing refresh token", 401);

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: string;
    email: string;
    role: string;
  };

  const user = await UserModel.findById(decoded.id);
  if (!user || user.refreshToken !== token) {
    throw new AppError("Invalid refresh token", 403);
  }

  const accessToken = generateToken(user.id, user.email, user.role, "15m");
  return sendResponse(res, 200, { accessToken }, "Access token refreshed");
});

export const LogoutController = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (token) {
    const decoded = jwt.decode(token) as { id: string };
    await UserModel.findByIdAndUpdate(decoded.id, {
      $unset: { refreshToken: "" },
    });
    res.clearCookie("refreshToken");
  }
  return sendResponse(res, 200, { message: "Logged out successfully" });
});

const EditProfileSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
});

export const EditProfileController = catchAsync(
  async (req: AuthenticatedRequest, res) => {
    const data = EditProfileSchema.parse(req.body);

    const updated = await UserModel.findByIdAndUpdate(req.user?.id, data, {
      new: true,
    }).select("-password -refreshToken");

    if (!updated) throw new AppError("User not found", 404);

    return sendResponse(res, 200, updated, "Profile updated successfully");
  }
);

const ResetPasswordSchema = z.object({
  token: z.string(),
  newPassword: z.string().min(6),
});

export const ResetPasswordController = catchAsync(async (req, res) => {
  const { token, newPassword } = ResetPasswordSchema.parse(req.body);

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: string;
  };

  const user = await UserModel.findById(decoded.id);
  if (!user) throw new AppError("User not found", 404);

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return sendResponse(res, 200, { message: "Password reset successful" });
});
