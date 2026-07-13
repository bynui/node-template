import pool from "@configs/db.js";
import crypto from "crypto";
import type { PoolClient, QueryConfig } from "pg";
import ErrorHandler from "./ErrorHandler";
import type { ModelType } from "@interfaces/cores/Model";

export default abstract class Model {
  private statementCache = new Map<string, string>();

  #generateStatementName(sql: string): string {
    if (this.statementCache.has(sql)) return this.statementCache.get(sql)!;
    const name =
      "stmt_" +
      crypto.createHash("sha1").update(sql).digest("hex").substring(0, 10);
    this.statementCache.set(sql, name);
    return name;
  }

  async execute<T = any>({
    sql,
    parameters = [],
    useTransaction = false,
  }: ModelType): Promise<T[]> {
    const client: PoolClient = await pool.connect();

    try {
      if (useTransaction) await client.query("BEGIN");

      const preparedStatement: QueryConfig = {
        name: this.#generateStatementName(sql),
        text: sql,
        values: parameters,
      };

      const { rows } = await client.query(preparedStatement);
      if (useTransaction) await client.query("COMMIT");
      return rows;
    } catch (error: any) {
      if (useTransaction) await client.query("ROLLBACK");
      throw new ErrorHandler(error.message);
    } finally {
      try {
        client.release();
      } catch (releaseError) {
        console.error("Error releasing DB client:", releaseError);
      }
    }
  }
}
