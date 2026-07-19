import { readdir } from "fs/promises";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import type { FastifyInstance } from "fastify";

export default class Route {
  private app: FastifyInstance;
  private routesPath: string;
  private currentFile: string;

  constructor(app: FastifyInstance) {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    this.app = app;
    this.routesPath = path.resolve(__dirname, "../src/routes");
    this.currentFile = path.basename(__filename);
  }

  async initialize(): Promise<void> {
    await this.#loadRoutes();
  }

  async #loadRoutes(): Promise<void> {
    const files = await this.#walkDir(this.routesPath);

    for (const filePath of files) {
      const relativePath = path.relative(this.routesPath, filePath);
      const { name: routeName, ext } = path.parse(relativePath);

      // Skip the index file, the current file, and non-script files
      if (
        path.basename(filePath) === this.currentFile ||
        routeName === "index" ||
        (ext !== ".ts" && ext !== ".js") ||
        filePath.endsWith(".d.ts")
      ) {
        continue;
      }

      const fileUrl = pathToFileURL(filePath).href;

      try {
        const { default: routePlugin } = await import(fileUrl);

        if (typeof routePlugin !== "function") continue;

        if (/^class\s/.test(routePlugin.toString())) {
          continue;
        }

        // Build prefix from relative path: e.g. "test/Example.ts" -> "/test/example"
        const dir = path.dirname(relativePath);
        const prefixDir =
          dir === "." ? "" : `/${dir.replace(/\\/g, "/").toLowerCase()}`;
        const prefix = `${prefixDir}/${routeName.toLowerCase()}`;

        await this.app.register(routePlugin, {
          prefix,
        });
      } catch (err) {
        console.error(`Error registering route ${filePath}:`, err);
      }
    }
  }

  async #walkDir(dir: string): Promise<string[]> {
    const entries = await readdir(dir, { withFileTypes: true });
    const files: string[] = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory()) {
        const subFiles = await this.#walkDir(fullPath);
        files.push(...subFiles);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }

    return files;
  }
}
