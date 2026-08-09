import "express";

declare global {
  namespace Express {
    interface Request {
      t(key: string, params?: Record<string, string>): string;
    }
  }
}