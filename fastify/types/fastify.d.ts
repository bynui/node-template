import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    t(key: string, params?: Record<string, string>): string;
  }
}
