import { type Request, type Response, type NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. Handle Zod Schema Validation Errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation Error",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // 2. Handle Custom or Generic Express Errors
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    message: message,
  });
};




