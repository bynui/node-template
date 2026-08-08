import exampleModel from "@models/Examples";
import Controller from "@cores/Controller";
import type { FastifyReply, FastifyRequest } from "fastify";

class Examples extends Controller {
  postTest = async (request: FastifyRequest, reply: FastifyReply) => {
    return this.response({ message: "test.success" }, request, reply);
  };

  getAllExample = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await exampleModel.getExample();
    return this.response({ result }, request, reply);
  };

  getExampleById = async (request: FastifyRequest, reply: FastifyReply) => {
    const result = await exampleModel.getExampleById([
      (request.params as any).id,
    ]);
    return this.response({ result }, request, reply);
  };
}

export default new Examples();
