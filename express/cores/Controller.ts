import type { Request, Response } from "express";
import type {
  PaginationResult,
  ResponseOptions,
} from "@interfaces/cores/Controller";
import { SUPPORTED_LANGUAGES } from "@configs/language";
import type { Language } from "@configs/language";

export default abstract class Controller {
  protected getLanguage(req: Request): Language {
    const lang = (req.headers["language"] as string) ?? "en";
    return (SUPPORTED_LANGUAGES as readonly string[]).includes(lang)
      ? (lang as Language)
      : ("en" as Language);
  }

  protected pagination(request: Request) {
    const q: any = (request.query ?? {}) as any;
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
    { status = 200, message = "ok", result = [] }: ResponseOptions<T> = {},
    req: Request,
    res: Response,
  ): Response {
    const { pagination } = this.pagination(req);

    const json: any = {
      response: status,
      message: message ? req.t(message) : "",
      ...(status === 200 && { page: { ...pagination } }),
      result,
    };

    if (Array.isArray(result) && result.length) {
      if ((result[0] as any).datacount) {
        const datacount = parseInt((result[0] as any).datacount);
        if (json.page) {
          json.page.rowsTotal = datacount;
          json.page.totalPage = Math.ceil(
            json.page.rowsTotal / json.page.display,
          );
        }
        const sanitized = (result as (T & { datacount?: number })[]).map(
          ({ datacount, ...rest }) => rest,
        );
        json.result = sanitized;
      } else {
        if (json.page) json.page.rowsTotal = result.length;
        json.result = result;
      }
    }

    res.status(status).json(json);
    return res;
  }
}
