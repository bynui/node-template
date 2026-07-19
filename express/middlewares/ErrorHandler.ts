import type { Request, Response, NextFunction } from "express";
import type { CustomError } from "@interfaces/cores/CustomError";

class ErrorHandler {
  private env: string;

  constructor() {
    this.env = process.env.ENV || "development";
    this.handle = this.handle.bind(this);
  }

  handle(
    error: Error & Partial<CustomError>,
    _request: Request,
    reply: Response,
    _next: NextFunction,
  ): void {
    const statusCode = (error as any).statusCode || 500;

    const json: Record<string, any> = {
      response: statusCode,
      message: error.message || "Internal Server Error",
    };

    if (this.env !== "production" && error.stack) {
      json.trace = error.stack.split("\n").map((item) => item.trim());
    }

    if ((error as any).allowed) {
      reply.setHeader("Allow", (error as any).allowed.join(", "));
    }

    reply.status(statusCode).json(json);
  }
}

export default new ErrorHandler();
