import * as dotenv from "dotenv";
import express, {
  type Request,
  type Response,
  type NextFunction,
  type RequestHandler,
  type ErrorRequestHandler,
} from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import I18n from "@middlewares/I18n.js";
import ErrorHandler from "@middlewares/ErrorHandler";
import Route from "cores/Route";

console.clear();

dotenv.config({ path: `.env.${process.env.ENV || "development"}` });

const app = express();

// Security & parsing middleware
app.use(helmet());
app.use(compression());
app.use(cors({ origin: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// I18n middleware
app.use(I18n.middleware as RequestHandler);

// Normalize error payloads
const normalizeResponse: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const originalJson = res.json.bind(res);
  res.json = function (body: any) {
    if (
      body &&
      (body.statusCode || body.error || body.response === undefined) &&
      res.statusCode >= 400
    ) {
      const status = body.statusCode || body.response || res.statusCode || 500;
      const message =
        body.message || body.error || body.code || "Internal Server Error";
      return originalJson({ response: status, message });
    }
    return originalJson(body);
  } as typeof res.json;

  next();
};
app.use(normalizeResponse);

// Initialize routes
const routeIndex = new Route(app);
await routeIndex.initialize();

// 404 handler
const notFoundHandler: RequestHandler = (_req: Request, res: Response) => {
  res
    .status(403)
    .json({ response: 403, message: "Hello... Is it me you're looking for?" });
};
app.use(notFoundHandler);

// Global error handler
app.use(ErrorHandler.handle as ErrorRequestHandler);

const PORT = Number(process.env.PORT || process.env.APP_PORT || 3000);

app.listen(PORT, () => {
  console.log(`🚀 ${process.env.ENV} server is running on port ${PORT}`);
});

export default app;
