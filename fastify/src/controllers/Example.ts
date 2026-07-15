import exampleModel from "@models/Example";
import Controller from "@cores/Controller";
import type { FastifyRequest } from "fastify";

class Example extends Controller {
  async getAllExample() {
    const result = await exampleModel.getAll();
    return this.response({ result });
  }

  async getExampleById(req: FastifyRequest) {
    const result = await exampleModel.getExample([
      (req.params as any).id,
    ]);
    return this.response({ result });
  }
}

export default new Example();
