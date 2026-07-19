import { readdir } from "fs/promises";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import type { Express, Router } from "express";

export default class Route {
  private app: Express;
  private routesPath: string;
  private currentFile: string;

  constructor(app: Express) {
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
    const files = await readdir(this.routesPath);

    for (const file of files) {
      const { name: routeName, ext } = path.parse(file);

      // Skip the index file, the current file, and non-script files
      if (
        file === this.currentFile ||
        routeName === "index" ||
        (ext !== ".ts" && ext !== ".js") ||
        file.endsWith(".d.ts")
      ) {
        continue;
      }

      const filePath = path.join(this.routesPath, file);
      const fileUrl = pathToFileURL(filePath).href;

      try {
        const { default: routeModule } = await import(fileUrl);

        if (typeof routeModule !== "function") continue;

        if (/^class\s/.test(routeModule.toString())) {
          continue;
        }

        this.app.use(`/${routeName.toLowerCase()}`, routeModule as Router);
      } catch (err) {
        console.error(`Error registering route ${file}:`, err);
      }
    }
  }
}
