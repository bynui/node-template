import { type LanguageMapEntry, LANGUAGE_MAP } from "./language-map";

const DEFAULT_LANGUAGE = "en";

export const SUPPORTED_LANGUAGES = LANGUAGE_MAP.map((entry) => entry.i18n);
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

const DEFAULT_ENTRY: LanguageMapEntry =
  LANGUAGE_MAP.find((entry) => entry.i18n === DEFAULT_LANGUAGE) ??
  LANGUAGE_MAP[0]!;

export function lookupLanguage(
  code: string | undefined | null,
): LanguageMapEntry {
  const normalized = code?.trim().toLowerCase();
  return (
    LANGUAGE_MAP.find(
      (entry) =>
        entry.i18n === normalized ||
        entry.iso6393 === normalized ||
        entry.language === normalized,
    ) ?? DEFAULT_ENTRY
  );
}

export function languageName(code: string | undefined | null): string {
  return lookupLanguage(code).language;
}

export function normalizeLanguage(code: string | undefined | null): Language {
  return lookupLanguage(code).i18n;
}
