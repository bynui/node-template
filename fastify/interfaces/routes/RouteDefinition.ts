import type { RouteHandlerMethod } from "fastify";

export interface RouteDefinition {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  url: string;
  handler: RouteHandlerMethod;
}
