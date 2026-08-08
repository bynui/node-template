export interface ModelType {
  sql: string;
  values?: unknown[];
  useTransaction?: boolean;
}
