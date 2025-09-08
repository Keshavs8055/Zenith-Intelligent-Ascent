import { NextFunction, Response, RequestHandler, Request } from "express";
import { ApiResponse } from "@zenith/types";

export function sendResponse<T>(
  res: Response,
  statusCode: number,
  data?: T,
  message?: string
) {
  const response: ApiResponse<T> = {
    success: statusCode < 400,
    statusCode,
    message,
    data,
  };

  return res.status(statusCode).json(response);
}

export const catchAsync = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
): RequestHandler => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
