"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table/data-table";
import { ColumnHeader } from "@/components/shared/data-table/column-header";
import { RowActions } from "@/components/shared/data-table/row-actions";
import { FilterBar } from "@/components/shared/filter-bar";
import { SearchInput } from "@/components/shared/search-input";
import { useOthersVehicles } from "../hooks/use-others-vehicles";
import { useLookup } from "@/lib/use-lookup";
import type { OtherVehicle } from "../types";

function clampPage(v: number): number {
  return Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1;
}

function clampPageSize(v: number): number {
  return [10, 25, 50, 100].includes(v) ? v : 25;
}

export function OthersVehiclesTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const page = clampPage(Number(searchParams.get("page") ?? "1"));
  const pageSize = clampPageSize(Number(searchParams.get("pageSize") ?? "25"));
  const rawSort = searchParams.get("sort") ?? "s-n";
  const sort = rawSort === "formatedNo" ? "formatedNo" : "s-n";
  const order = searchParams.get("order") === "desc" ? "desc" : "asc";

  const query = useOthersVehicles({ q, page, pageSize, sort, order });
  const plateTypesQuery = useLookup("plate-types");

  const setUrlParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const columns: ColumnDef<OtherVehicle, unknown>[] = [
    {
      accessorKey: "s-n",
      header: ({ column }) => <ColumnHeader column={column} title="S.N" />,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums text-[var(--color-mut)]">
          {row.original["s-n"]}
        </span>
      ),
    },
    {
      accessorKey: "formatedNo",
      header: ({ column }) => (
        <ColumnHeader column={column} title="Formated No" />
      ),
      cell: ({ row }) => (
        <span className="font-mono text-[var(--color-fg)]">
          {row.original.formatedNo}
        </span>
      ),
    },
    {
      accessorKey: "numberType",
      header: "Number Type",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-[var(--color-fg)]">{row.original.numberType}</span>
      ),
    },
    {
      id: "plateType",
      header: "Plate Type",
      enableSorting: false,
      cell: ({ row }) => {
        const plateType = plateTypesQuery.data?.find(
          (p) => p.value === row.original.plateTypeId
        );
        return (
          <span className="text-[var(--color-fg)]">{plateType?.label ?? "—"}</span>
        );
      },
    },
    {
      id: "actions",
      header: "",
      meta: { align: "right" },
      cell: ({ row }) => (
        <RowActions
          onView={() => router.push(`/vehicle/others/${row.original.id}`)}
          onEdit={() =>
            router.push(`/vehicle/others/${row.original.id}/edit`)
          }
        />
      ),
    },
  ];

  const meta = query.data?.meta ?? {
    page: 1,
    pageSize,
    total: 0,
    totalPages: 1,
  };

  return (
    <div>
      <PageHeader
        title="Other's Vehicle"
        description="Non-registered and third-party vehicles."
        actions={
          <Button asChild>
            <Link href="/vehicle/others/new">
              <Plus className="size-4" aria-hidden="true" />
              Add entry
            </Link>
          </Button>
        }
      />

      <div className="mb-4 rounded-[8px] border border-[var(--color-warnw)] bg-[var(--color-warnw)] px-3 py-2 text-sm text-[var(--color-warn)]">
        The system derives the formatted number and number type from the
        selected type. Edit the type to change them.
      </div>

      <div className="flex flex-col gap-4">
        <FilterBar onClear={() => setUrlParams({ q: undefined, page: 1 })}>
          <SearchInput
            value={q}
            onChange={(v) => setUrlParams({ q: v || undefined, page: 1 })}
            placeholder="Search by formatted no…"
          />
        </FilterBar>

        <DataTable<OtherVehicle>
          columns={columns}
          data={query.data?.data ?? []}
          isLoading={query.isPending}
          isError={query.isError}
          error={query.error}
          onRetry={() => query.refetch()}
          sorting={[{ id: sort, desc: order === "desc" }]}
          onSortingChange={(next) => {
            const first = next[0];
            setUrlParams(
              first
                ? {
                    sort: first.id,
                    order: first.desc ? "desc" : "asc",
                    page: 1,
                  }
                : { sort: undefined, order: undefined, page: 1 }
            );
          }}
          pagination={meta}
          onPageChange={(p) => setUrlParams({ page: p })}
          onPageSizeChange={(s) => setUrlParams({ pageSize: s, page: 1 })}
          emptyState={{
            title: q ? "No entries match" : "No other vehicles registered",
            description: q
              ? "Try a different formatted number or clear the search."
              : "Register the first entry to get started.",
            action: q
              ? {
                  label: "Clear search",
                  onClick: () => setUrlParams({ q: undefined, page: 1 }),
                }
              : { label: "Add entry", href: "/vehicle/others/new" },
          }}
          getRowId={(v) => v.id}
        />
      </div>
    </div>
  );
}