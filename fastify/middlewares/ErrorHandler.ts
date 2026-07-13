import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import type { CustomError } from "@interfaces/cores/CustomError";

class ErrorHandler {
  private env: string;

  constructor() {
    this.env = process.env.ENV || "development";
    this.handle = this.handle.bind(this);
  }

  handle(
    error: FastifyError & Partial<CustomError>,
    _request: FastifyRequest,
    reply: FastifyReply,
  ): void {
    const statusCode = error.statusCode || 500;

    const json: Record<string, any> = {
      response: statusCode,
      message: error.message || "Internal Server Error",
    };

    if (this.env !== "production" && error.stack) {
      json.trace = error.stack.split("\n").map((item) => item.trim());
    }

    if (error.allowed) {
      reply.header("Allow", error.allowed.join(", "));
    }

    reply.code(statusCode).send(json);
  }
}

export default new ErrorHandler();
