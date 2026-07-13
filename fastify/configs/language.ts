export const SUPPORTED_LANGUAGES = ["id", "en"] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];
