import type { FastifyPluginAsync } from "fastify";
import examples from "@controllers/Examples";

const plugin: FastifyPluginAsync = async (app) => {
  app.post("/test", examples.postTest);
  app.get("", examples.getAllExample);
  app.get("/:id", examples.getExampleById);
};

export default plugin;
