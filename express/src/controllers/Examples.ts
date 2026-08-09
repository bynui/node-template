import exampleModel from "@models/Examples";
import Controller from "@cores/Controller";
import type { Request, Response } from "express";

class Examples extends Controller {
  postTest = async (req: Request, res: Response) => {
    return this.response({ message: "test.success" }, req, res);
  };

  getAllExample = async (req: Request, res: Response) => {
    const result = await exampleModel.getExample();
    return this.response({ result }, req, res);
  };

  getExampleById = async (req: Request, res: Response) => {
    const result = await exampleModel.getExampleById([
      (req.params as any).id,
    ]);
    return this.response({ result }, req, res);
  };
}

export default new Examples();
