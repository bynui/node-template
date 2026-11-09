export const LANGUAGE_MAP = [
  {
    language: "english",
    i18n: "en",
    iso6393: "eng",
  },
  {
    language: "indonesia",
    i18n: "id",
    iso6393: "ind",
  },
] as const;

export type LanguageMapEntry = (typeof LANGUAGE_MAP)[number];