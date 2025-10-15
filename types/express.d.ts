import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        mobile: string;
        fullname: string;
      };
    }
  }
}
