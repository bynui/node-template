import type { Request, Response } from "express";
import I18n from "@middlewares/I18n.js";
import type {
  PaginationResult,
  ResponseOptions,
} from "@interfaces/cores/Controller";
import { SUPPORTED_LANGUAGES } from "@configs/language";
import type { Language } from "@configs/language";

export default abstract class Controller {
  protected req!: Request;
  protected res!: Response;
  protected language!: Language;

  constructor() {
    const propertyNames = Object.getOwnPropertyNames(
      Object.getPrototypeOf(this),
    );

    propertyNames.forEach((name) => {
      if (name !== "constructor" && typeof (this as any)[name] === "function") {
        const original = (this as any)[name];
        (this as any)[name] = (req: Request, res: Response) => {
          this.req = req;
          this.res = res;
          const lang = (req.headers["language"] as string) ?? "id";
          this.language = (SUPPORTED_LANGUAGES as readonly string[]).includes(
            lang,
          )
            ? (lang as Language)
            : ("en" as Language);
          return original.call(this, req, res);
        };
      }
    });
  }

  protected pagination() {
    const q: any = (this.req.query ?? {}) as any;
    const page = parseInt(q.page as string) || 1;
    const pageSize = parseInt(process.env.DISPLAY_LIMIT || "10"); // default 10
    const offset = (page - 1) * pageSize;

    const pagination: PaginationResult = {
      display: pageSize,
      currentPage: page,
      totalPage: 0,
      rowsTotal: 0,
    };

    const query = [pageSize, offset];

    return { pagination, query };
  }

  protected response<T = any>(
    { status = 200, result = [] }: ResponseOptions<T> = {},
    translationKey?: string,
  ): Response {
    const { pagination } = this.pagination();

    const json: any = {
      response: status,
      page: { ...pagination },
      result,
    };

    if (Array.isArray(result) && result.length) {
      if ((result[0] as any).datacount) {
        const datacount = parseInt((result[0] as any).datacount);
        json.page.rowsTotal = datacount;
        json.page.totalPage = Math.ceil(
          json.page.rowsTotal / json.page.display,
        );
        const sanitized = (result as (T & { datacount?: number })[]).map(
          ({ datacount, ...rest }) => rest,
        );
        json.result = sanitized;
      } else {
        json.page.rowsTotal = result.length;
        json.result = result;
      }
    }

    if (translationKey) {
      delete json.result;
      json.code = translationKey;
      json.message = I18n.t(translationKey);
    }

    this.res.status(status).json(json);
    return this.res;
  }
}
