import type { Request, Response, NextFunction } from "express";
import { z, ZodError } from "zod";

import { StatusCodes } from "http-status-codes";

export function validateData(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Check if body is missing
      if (req.body === undefined || req.body === null) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          error: "Invalid data",
          details: [
            {
              message: "Request body is required",
            },
          ],
        });
      }

      schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => {
          const path =
            issue.path.length > 0 ? issue.path.join(".") : "request body";
          return {
            message: `${path} is ${issue.message}`,
          };
        });
        res.status(StatusCodes.BAD_REQUEST).json({
          error: "Invalid data",
          details: errorMessages,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "Internal Server Error",
        });
      }
    }
  };
}

// For query parameters
export function validateQuery(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.query);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => {
          const path =
            issue.path.length > 0 ? issue.path.join(".") : "query parameters";
          return {
            message: `${path} is ${issue.message}`,
          };
        });
        res.status(StatusCodes.BAD_REQUEST).json({
          error: "Invalid query parameters",
          details: errorMessages,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "Internal Server Error",
        });
      }
    }
  };
}

// For URL parameters
export function validateParams(schema: z.ZodObject<any, any>) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse(req.params);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errorMessages = error.issues.map((issue: any) => {
          const path =
            issue.path.length > 0 ? issue.path.join(".") : "URL parameters";
          return {
            message: `${path} is ${issue.message}`,
          };
        });
        res.status(StatusCodes.BAD_REQUEST).json({
          error: "Invalid URL parameters",
          details: errorMessages,
        });
      } else {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: "Internal Server Error",
        });
      }
    }
  };
}

// Alias for backward compatibility
export const validateBody = validateData;
