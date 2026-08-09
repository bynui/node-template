import type { Request, Response, NextFunction } from "express";
import ErrorHandler from "@cores/ErrorHandler";
import type { I18nTranslations } from "@interfaces/middlewares/i18n";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";

class I18n {
  async #loadLanguage(lang: string): Promise<I18nTranslations> {
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

  #translate(
    translations: I18nTranslations,
    key: string,
    params: Record<string, string> = {},
  ): string {
    const keys = key.split(".");
    let template: any = translations;

    for (const k of keys) {
      template = template?.[k];
    }

    if (!template || typeof template !== "string") return key;
    return this.#replacePlaceholders(template, params);
  }

  middleware = async (req: Request, _res: Response, next: NextFunction) => {
    const lang = (req.headers["language"] as string) ?? "en";
    const translations = await this.#loadLanguage(lang);

    req.t = (key: string, params?: Record<string, string>) =>
      this.#translate(translations, key, params);

    next();
  };
}

export default new I18n();
