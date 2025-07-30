export interface PagedResponse<T> {
  data: T[];
  totalElements: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  isLast: boolean;
  message: string;
}
