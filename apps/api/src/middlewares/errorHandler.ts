import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/appError.js";
import { ApiResponse } from "@zenith/types";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Handle Zod validation errors
  if (err.name === "ZodError") {
    statusCode = 400;
    message = err.errors.map((e: any) => e.message).join(", ");
  }

  const response: ApiResponse<null> = {
    success: false,
    statusCode,
    message,
    data: null,
  };

  if (process.env.NODE_ENV !== "production") {
    (response as any).stack = err.stack;
  }

  res.status(statusCode).json(response);
}
