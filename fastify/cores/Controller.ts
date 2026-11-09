import type { FastifyRequest, FastifyReply } from "fastify";
import type {
  PaginationResult,
  ResponseOptions,
} from "@interfaces/cores/Controller";
import { type Language, normalizeLanguage } from "@configs/language";
import requestContext from "@helpers/RequestContext";

export default abstract class Controller {
  private get request() {
    const request = requestContext.getStore();
    if (!request) {
      throw new Error("Request context is not available");
    }
    return request;
  }

  protected get headers() {
    return this.request.headers;
  }

  protected get language(): Language {
    return normalizeLanguage(this.headers.language as string | undefined);
  }

  protected get params(): Record<string, string> {
    return this.request.params as Record<string, string>;
  }

  protected get body(): Record<string, unknown> {
    return this.request.body as Record<string, unknown>;
  }

  protected pagination(request: FastifyRequest) {
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
    {
      status = 200,
      message = "ok",
      result = [],
      pagination = false,
    }: ResponseOptions<T> = {},
    request: FastifyRequest,
    reply: FastifyReply,
  ): FastifyReply {
    // Only build the page block when the endpoint opts into pagination.
    const page = pagination ? this.pagination(request).pagination : undefined;

    const json: any = {
      response: status,
      message: message ? request.t(message) : "",
      ...(status === 200 && page && { page: { ...page } }),
      result,
    };

    if (Array.isArray(result) && result.length) {
      if ((result[0] as any).datacount) {
        const datacount = parseInt((result[0] as any).datacount);
        if (page) {
          page.rowsTotal = datacount;
          page.totalPage = Math.ceil(page.rowsTotal / page.display);
        }
        const sanitized = (result as (T & { datacount?: number })[]).map(
          ({ datacount, ...rest }) => rest,
        );
        json.result = sanitized;
      } else if (page) {
        page.rowsTotal = result.length;
        json.result = result;
      }
    }

    reply.code(status).send(json);
    return reply;
  }
}
