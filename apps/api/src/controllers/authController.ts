import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { RegisterUserSchema, LoginSchema, Session } from "@zenith/types";
import UserModel from "../models/user.js";
import { catchAsync, sendResponse } from "../utils/globalWrapper.js";
import { generateToken } from "../utils/token.js";
import z from "zod";
import { AuthenticatedRequest } from "../middlewares/requireAuth.js";

// -------------------
// Controllers
// -------------------
export const UserSignUpController = catchAsync(async (req, res) => {
  const parsed = RegisterUserSchema.parse(req.body);

  const existingUser = await UserModel.findOne({ email: parsed.email });
  if (existingUser) {
    return sendResponse(res, 400, undefined, "Email already in use");
  }

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
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
    expiresAt: new Date(Date.now() + 3600000).toISOString(),
  };

  return sendResponse(res, 201, session);
});

export const UserLoginController = catchAsync(async (req, res) => {
  const parsed = LoginSchema.parse(req.body);

  const user = await UserModel.findOne({ email: parsed.email });
  if (!user) return sendResponse(res, 404, undefined, "User not found");

  const isMatch = await bcrypt.compare(parsed.password, user.password);
  if (!isMatch) return sendResponse(res, 401, undefined, "Invalid credentials");

  const token = generateToken(user.id, user.email, user.role, "1h");

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
  const refreshToken = generateToken(user.id, user.email, user.role, "7d");
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });
  return sendResponse<Session>(res, 200, session);
});

const ForgotPasswordSchema = z.object({
  email: z.string().email(),
});

export const ForgotPasswordController = catchAsync(async (req, res) => {
  const { email } = ForgotPasswordSchema.parse(req.body);

  const user = await UserModel.findOne({ email });
  if (!user) return sendResponse(res, 404, undefined, "User not found");

  const resetToken = jwt.sign(
    { id: user.id },
    process.env.JWT_SECRET as string,
    { expiresIn: "15m" }
  );

  return sendResponse(res, 200, {
    message: "Password reset token generated",
    resetToken,
  });
});

export const RefreshTokenController = catchAsync(async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return sendResponse(res, 401, undefined, "Missing refresh token");

  const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
    id: string;
    email: string;
    role: string;
  };

  const user = await UserModel.findById(decoded.id);
  if (!user || user.refreshToken !== token)
    return sendResponse(res, 403, undefined, "Invalid refresh token");

  const accessToken = generateToken(user.id, user.email, user.role, "15m");
  return sendResponse(res, 200, { accessToken });
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

    return sendResponse(res, 200, updated);
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
  if (!user) return sendResponse(res, 404, undefined, "User not found");

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  return sendResponse(res, 200, { message: "Password reset successful" });
});
