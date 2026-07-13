import Model from "@cores/Model";
import type { ModelType } from "@interfaces/cores/Model";

class Example extends Model {
  async getExample(): Promise<any> {
    let sql = `select * from sample`;
    return this.execute({ sql } as ModelType);
  }

  async getExampleById(parameters: any[]): Promise<any> {
    let sql = `select * from sample where id = $1`;
    return this.execute({ sql, parameters } as ModelType);
  }
}

export default new Example();
