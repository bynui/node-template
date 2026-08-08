import Model from "@cores/Model";
import type { ModelType } from "@interfaces/cores/Model";

class Examples extends Model {
  async getExample(): Promise<any> {
    let sql = `select * from sample`;
    return this.execute({ sql } as ModelType);
  }

  async getExampleById(values: any[]): Promise<any> {
    let sql = `select * from sample where id = $1`;
    return this.execute({ sql, values } as ModelType);
  }
}

export default new Examples();
