export type ApiResponse<T = undefined> = {
  success: boolean;
  statusCode: number;
  message?: string;
  data?: T;
};

export type PaginatedResponse<T> = ApiResponse<{
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}>;
