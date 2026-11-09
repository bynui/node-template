import { AsyncLocalStorage } from "node:async_hooks";
import type { FastifyRequest } from "fastify";

export default new AsyncLocalStorage<FastifyRequest>();
