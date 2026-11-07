import "@tanstack/react-table";

declare module "@tanstack/react-table" {
  // Extend ColumnMeta so columns can declare an `align` hint.
  // The DataTable reads this to right-align numeric columns
  // and centre status columns.
  interface ColumnMeta<TData extends RowData, TValue> {
    align?: "left" | "right" | "center";
  }
}

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

}

export {};