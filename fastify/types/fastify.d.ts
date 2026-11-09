import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    /**
     * Translate `key` for the request locale (from the `language` header,
     * defaulting to "en"). A flexible language code can be passed as the
     * third argument to override it — both ISO 639-1 ("en", "id") and
     * ISO 639-3 ("eng", "ind") are accepted and normalized to the closest
     * supported translation.
     */
    t(key: string, params?: Record<string, string>, lang?: string): string;
  }
}
