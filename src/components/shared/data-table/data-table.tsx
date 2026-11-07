"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
  type SortingState,
  type Updater,
} from "@tanstack/react-table";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "./pagination";
import { cn } from "@/lib/cn";

interface DataTablePagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

interface DataTableEmpty {
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry?: () => void;
  sorting?: SortingState;
  onSortingChange?: (updater: Updater<SortingState>) => void;
  pagination: DataTablePagination;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  emptyState: DataTableEmpty;
  skeletonRowCount?: number;
  getRowId?: (row: TData) => string;
}

export function DataTable<TData>({
  columns,
  data,
  isLoading,
  isError,
  error,
  onRetry,
  sorting = [],
  onSortingChange,
  pagination,
  onPageChange,
  onPageSizeChange,
  emptyState,
  skeletonRowCount = 8,
  getRowId,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
    pageCount: pagination.totalPages,
    getRowId,
  });

  if (isError) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }

  if (!isLoading && data.length === 0) {
    return <EmptyState {...emptyState} />;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm" aria-busy={isLoading}>
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-slate-200 bg-slate-50">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    scope="col"
                    aria-sort={
                      header.column.getIsSorted() === "asc"
                        ? "ascending"
                        : header.column.getIsSorted() === "desc"
                          ? "descending"
                          : header.column.getCanSort()
                            ? "none"
                            : undefined
                    }
                    className={cn(
                      "px-3 py-2 text-left text-xs font-medium uppercase tracking-wide text-slate-500",
                      header.column.columnDef.meta?.align === "right" && "text-right",
                      header.column.columnDef.meta?.align === "center" && "text-center"
                    )}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading
              ? Array.from({ length: skeletonRowCount }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    {columns.map((_, colIndex) => (
                      <td key={colIndex} className="px-3 py-3">
                        <Skeleton
                          className={cn(
                            "h-4",
                            colIndex === 0 ? "w-12" : "w-full max-w-40"
                          )}
                        />
                      </td>
                    ))}
                  </tr>
                ))
              : table.getRowModel().rows.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-slate-100 transition-colors hover:bg-slate-50/60"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-3 py-2.5 text-slate-700",
                          cell.column.columnDef.meta?.align === "right" && "text-right",
                          cell.column.columnDef.meta?.align === "center" && "text-center"
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
          </tbody>
        </table>
      </div>
      {!isLoading && (
        <Pagination
          page={pagination.page}
          pageSize={pagination.pageSize}
          total={pagination.total}
          totalPages={pagination.totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
    </div>
  );
}