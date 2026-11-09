import { AsyncLocalStorage } from "node:async_hooks";
import type { Request } from "express";

export const requestContext: AsyncLocalStorage<Request> =
  new AsyncLocalStorage<Request>();

export default requestContext;