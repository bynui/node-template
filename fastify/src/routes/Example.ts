import type { FastifyPluginAsync } from "fastify";
import example from "@controllers/Example";

const plugin: FastifyPluginAsync = async (app) => {
  app.get("", async (request, reply) => {
    await (example as any).getAllExample(request, reply);
  });

  app.get("/:id", async (request, reply) => {
    await (example as any).getExampleById(request, reply);
  });
};

export default plugin;
