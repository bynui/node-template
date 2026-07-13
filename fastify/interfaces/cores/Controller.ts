export interface PaginationResult {
  display: number;
  currentPage: number;
  totalPage: number;
  rowsTotal: number;
}

export interface ResponseOptions<T = any> {
  status?: number;
  result?: T[];
}
