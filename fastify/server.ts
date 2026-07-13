import * as dotenv from "dotenv";
import Fastify from "fastify";
import cors from "@fastify/cors";
import cookie from "@fastify/cookie";
import I18n from "@middlewares/I18n.js";
import ErrorHandler from "@middlewares/ErrorHandler";
import RouteIndex from "./routes/RouteIndex.js";

console.clear();

dotenv.config({ path: `.env.${process.env.ENV || "development"}` });

const app = Fastify({
  logger: true,
  routerOptions: {
    ignoreTrailingSlash: true,
  },
});

await app.register(cors, {
  origin: true,
});

await app.register(cookie);

await app.register(I18n.plugin);

app.addHook("onSend", async (_req, reply, payload) => {
  reply.header("Cache-Control", "no-cache");
  reply.header("Access-Control-Allow-Origin", "*");

  // Normalize error payloads to { response, message }
  try {
    let parsed: any = null;

    if (typeof payload === "string") {
      parsed = JSON.parse(payload);
    } else if (payload && typeof payload === "object") {
      parsed = payload;
    }

    if (
      parsed &&
      (parsed.statusCode || parsed.error || parsed.response === undefined) &&
      reply.statusCode >= 400
    ) {
      const status =
        parsed.statusCode || parsed.response || reply.statusCode || 500;
      const message =
        parsed.message ||
        parsed.error ||
        parsed.code ||
        "Internal Server Error";
      return JSON.stringify({ response: status, message });
    }
  } catch (err) {
    // ignore parse errors and return original payload
  }

  return payload;
});

const routeIndex = new RouteIndex(app);
await routeIndex.initialize();

app.setNotFoundHandler((_req, reply) => {
  reply
    .code(403)
    .send({ response: 403, message: "Hello... Is it me you're looking for?" });
});

app.setErrorHandler(ErrorHandler.handle);

const PORT = Number(process.env.PORT || process.env.APP_PORT || 3000);

await app.listen({ port: PORT });

console.log(`🚀 ${process.env.ENV} server is running on port ${PORT}`);

export default app;
