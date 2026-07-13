import type { FastifyPluginAsync } from "fastify";
import amenities from "@controllers/Example";

const plugin: FastifyPluginAsync = async (app) => {
  app.get("", async (request, reply) => {
    await (amenities as any).getAllExample(request, reply);
  });

  app.get("/:id", async (request, reply) => {
    await (amenities as any).getExampleById(request, reply);
  });
};

export default plugin;
