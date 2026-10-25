export interface ApiResponse<Data> {
  success: true;
  data: Data;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedApiResponse<Item>
  extends ApiResponse<Item[]> {
  pagination: Pagination;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}
