import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "./requireAuth.js";
import { sendResponse } from "../utils/globalWrapper.js";

export const requireRole = (role: string) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== role) {
      return sendResponse(res, 403, undefined, "Forbidden: insufficient role");
    }
    next();
  };
};
