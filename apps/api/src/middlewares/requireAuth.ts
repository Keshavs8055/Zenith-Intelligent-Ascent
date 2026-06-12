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
    let token = req.cookies?.accessToken;
    
    // Fallback manual parser to guarantee compatibility even if cookie-parser isn't mounted correctly on the root router
    if (!token && req.headers.cookie) {
      const match = req.headers.cookie.match(/(?:^|;\s*)accessToken=([^;]*)/);
      if (match) token = match[1];
    }

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
