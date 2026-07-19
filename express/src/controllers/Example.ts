import exampleModel from "@models/Example";
import Controller from "@cores/Controller";
import type { Request } from "express";

class Example extends Controller {
  async getAllExample() {
    const result = await exampleModel.getExample();
    return this.response({ result });
  }

  async getExampleById(req: Request) {
    const result = await exampleModel.getExampleById([(req.params as any).id]);
    return this.response({ result });
  }
}

export default new Example();
