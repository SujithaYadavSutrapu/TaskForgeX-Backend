import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../utils/appError";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new AppError("No token provided", 401);
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new AppError("Invalid token format", 401);
  }

  const token = authHeader.split(" ")[1] as string;

  if (!process.env.JWT_SECRET) {
    throw new AppError("JWT secret not configured", 500);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    (req as any).user = decoded;

    next();
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
          throw new AppError("Token expired", 401);
    }else if (err instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token", 401);
    }
  }
};