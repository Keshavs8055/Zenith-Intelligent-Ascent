import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
import { sendResponse } from "../utils/globalWrapper.js";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return sendResponse(res, 401, undefined, "User needs to be logged in.");
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return sendResponse(res, 401, undefined, "User needs to be logged in.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: string;
      email: string;
      role: string;
    };

    const user = await UserModel.findById(decoded.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return sendResponse(res, 404, undefined, "User not found.");
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    return sendResponse(res, 401, undefined, "Kindly login again.");
  }
};
