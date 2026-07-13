export interface CustomError extends Error {
  statusCode?: number;
  allowed?: string[];
}
