import type { FastifyInstance } from "fastify";
import type { RouteDefinition } from "@interfaces/routes/RouteDefinition";

export default abstract class Router {
  protected app: FastifyInstance;

  constructor(app: FastifyInstance) {
    this.app = app;
    this.registerRoutes();
  }

  protected abstract getRouterList(): RouteDefinition[];

  private registerRoutes(): void {
    const routes = this.getRouterList();

    // Register routes
    for (const route of routes) {
      this.app.route({
        method: route.method,
        url: route.url,
        handler: route.handler,
      });
    }

    // 405 Method Not Allowed handler
    this.app.addHook("onRequest", async (req, reply) => {
      const allowedMethods = routes
        .filter((r) => r.url === req.url)
        .map((r) => r.method);

      if (
        allowedMethods.length > 0 &&
        !allowedMethods.includes(req.method as any)
      ) {
        reply
          .code(405)
          .header("Allow", allowedMethods.join(", "))
          .send({ response: 405, message: "Method Not Allowed" });
      }
    });
  }
}
