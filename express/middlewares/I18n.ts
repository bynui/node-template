import { AsyncLocalStorage } from "async_hooks";
import type { Request, Response, NextFunction } from "express";
import type { I18nStore } from "@interfaces/middlewares/i18n";
import ErrorHandler from "@cores/ErrorHandler";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";

class I18n {
  private als = new AsyncLocalStorage<I18nStore>();

  async #loadLanguage(lang: string): Promise<Record<string, any>> {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const langPath = pathToFileURL(
      path.join(__dirname, "../languages", `${lang}.js`),
    ).href;

    try {
      const module = await import(langPath);
      return module.default;
    } catch {
      throw new ErrorHandler(`Language not supported: ${lang}`);
    }
  }

  #replacePlaceholders(
    str: string,
    params: Record<string, string> = {},
  ): string {
    if (typeof str !== "string") return str;

    return str.replace(/{{(.*?)}}/g, (_, key: string) => {
      const k = key.trim();
      return params[k] ?? `{{${k}}}`;
    });
  }

  t(key: string, params: Record<string, string> = {}): string {
    const store = this.als.getStore();
    if (!store?.translations) return key;

    const keys = key.split(".");
    let template: any = store.translations;

    for (const k of keys) {
      template = template?.[k];
    }

    if (!template) return key;
    return this.#replacePlaceholders(template, params);
  }

  middleware = async (req: Request, _res: Response, next: NextFunction) => {
    const lang = (req.headers["language"] as string) ?? "id";
    const translations = await this.#loadLanguage(lang);

    this.als.run({ translations }, () => {
      (req as any).t = this.t.bind(this);
      next();
    });
  };
}

export default new I18n();
