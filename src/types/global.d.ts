
declare global {
  interface PaginationMeta {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  }

  interface ApiEnvelope<T> {
    data: T;
    meta?: PaginationMeta;
    errors?: Record<string, string[]>;
    message?: string;
  }

  interface LookupOption {
    value: string;
    label: string;
  }

  type Nullable<T> = T | null;

  interface AuthUser {
    id: string;
    name: string;
    role: string;
    checkpoint: string;
  }
}

export {};