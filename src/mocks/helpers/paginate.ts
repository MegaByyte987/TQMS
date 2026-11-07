export interface PaginateOptions {
  page?: number;
  pageSize?: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PaginationMeta;
}

export function paginate<T>(
  rows: T[],
  { page = 1, pageSize = 25 }: PaginateOptions = {}
): Paginated<T> {
  const safePageSize = Math.min(Math.max(pageSize, 1), 100);
  const safePage = Math.max(page, 1);
  const total = rows.length;
  const totalPages = Math.max(Math.ceil(total / safePageSize), 1);
  const start = (safePage - 1) * safePageSize;
  const items = rows.slice(start, start + safePageSize);

  return {
    items,
    meta: {
      page: safePage,
      pageSize: safePageSize,
      total,
      totalPages,
    },
  };
}