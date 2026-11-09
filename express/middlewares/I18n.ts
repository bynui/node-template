import type { Request, Response, NextFunction } from "express";
import ErrorHandler from "@cores/ErrorHandler";
import type { I18nTranslations } from "@interfaces/middlewares/i18n";
import path from "path";
import { pathToFileURL, fileURLToPath } from "url";
import {
  type Language,
  normalizeLanguage,
  SUPPORTED_LANGUAGES,
} from "@configs/language";

type I18nTranslate = (
  key: string,
  params?: Record<string, string>,
  lang?: string,
) => string;

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

  #translationsByLang = new Map<Language, I18nTranslations>();
  #preloaded = false;

  async #ensurePreloaded() {
    if (this.#preloaded) return;
    for (const lang of SUPPORTED_LANGUAGES) {
      this.#translationsByLang.set(lang, await this.#loadLanguage(lang));
    }
    this.#preloaded = true;
  }

  middleware = async (req: Request, _res: Response, next: NextFunction) => {
    await this.#ensurePreloaded();
    const lang = normalizeLanguage(
      req.headers["language"] as string | undefined,
    );
    const defaultTranslations = this.#translationsByLang.get(lang)!;

    // A flexible language code can be passed as the third argument to override
    // the request default (header -> "en"). Both ISO 639-1 ("en", "id") and
    // ISO 639-3 ("eng", "ind") are accepted and normalized.
    req.t = (key: string, params?: Record<string, string>, lang?: string) =>
      this.#translate(
        (lang
          ? this.#translationsByLang.get(normalizeLanguage(lang))
          : undefined) ?? defaultTranslations,
        key,
        params,
      );

    next();
  };
}

export default new I18n();
