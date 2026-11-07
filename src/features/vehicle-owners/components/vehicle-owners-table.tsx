"use client";

import { useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table/data-table";
import { ColumnHeader } from "@/components/shared/data-table/column-header";
import { RowActions } from "@/components/shared/data-table/row-actions";
import { FilterBar } from "@/components/shared/filter-bar";
import { SearchInput } from "@/components/shared/search-input";
import { useVehicleOwners } from "../hooks/use-vehicle-owners";
import type { VehicleOwner } from "../types";
import { orDash } from "@/lib/formatters";

function clampPage(v: number): number {
  return Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1;
}

function clampPageSize(v: number): number {
  return [10, 25, 50, 100].includes(v) ? v : 25;
}

export function VehicleOwnersTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const page = clampPage(Number(searchParams.get("page") ?? "1"));
  const pageSize = clampPageSize(Number(searchParams.get("pageSize") ?? "25"));
  const rawSort = searchParams.get("sort") ?? "s-n";
  const sort = rawSort === "name" ? "name" : "s-n";
  const order = searchParams.get("order") === "desc" ? "desc" : "asc";

  const query = useVehicleOwners({ q, page, pageSize, sort, order });

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

  const columns: ColumnDef<VehicleOwner, unknown>[] = [
    {
      accessorKey: "s-n",
      header: ({ column }) => <ColumnHeader column={column} title="S.N" />,
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums text-slate-500">
          {row.original["s-n"]}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: ({ column }) => <ColumnHeader column={column} title="Name / company" />,
    },
    {
      id: "address",
      header: "Address",
      enableSorting: false,
      cell: ({ row }) => {
        const parts = [
          row.original.streetAddress,
          row.original.districtId,
          row.original.stateId,
        ].filter(Boolean);
        return <span className="text-slate-600">{orDash(parts.join(", "))}</span>;
      },
    },
    {
      accessorKey: "phoneNumber",
      header: "Phone no.",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="tabular-nums">{row.original.phoneNumber}</span>
      ),
    },
    {
      id: "linked-owner",
      header: "Linked owner",
      enableSorting: false,
      cell: () => <span className="text-slate-400">(not populated)</span>,
    },
    {
      id: "is-assigned",
      header: "Is assigned",
      enableSorting: false,
      cell: () => <span className="text-slate-400">(not populated)</span>,
    },
    {
      id: "actions",
      header: "",
      meta: { align: "right" },
      cell: ({ row }) => (
        <RowActions
          onView={() => router.push(`/vehicle/owners/${row.original.id}`)}
          onEdit={() => router.push(`/vehicle/owners/${row.original.id}/edit`)}
        />
      ),
    },
  ];

  const sorting: SortingState = [{ id: sort, desc: order === "desc" }];
  const meta = query.data?.meta ?? { page: 1, pageSize, total: 0, totalPages: 1 };

  return (
    <div>
      <PageHeader
        title="Vehicle Owner"
        description="Registered owners and companies."
        actions={
          <Button asChild>
            <Link href="/vehicle/owners/new">
              <Plus className="size-4" aria-hidden="true" />
              Add owner
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        <FilterBar onClear={() => setUrlParams({ q: undefined, page: 1 })}>
          <SearchInput
            value={q}
            onChange={(v) => setUrlParams({ q: v || undefined, page: 1 })}
            placeholder="Search by name…"
          />
        </FilterBar>

        <DataTable<VehicleOwner>
          columns={columns}
          data={query.data?.data ?? []}
          isLoading={query.isPending}
          isError={query.isError}
          error={query.error}
          onRetry={() => query.refetch()}
          sorting={sorting}
          onSortingChange={(next) => {
            const first = next[0];
            setUrlParams(
              first
                ? { sort: first.id, order: first.desc ? "desc" : "asc", page: 1 }
                : { sort: undefined, order: undefined, page: 1 }
            );
          }}
          pagination={meta}
          onPageChange={(p) => setUrlParams({ page: p })}
          onPageSizeChange={(s) => setUrlParams({ pageSize: s, page: 1 })}
          emptyState={{
            title: q ? "No owners match" : "No vehicle owners yet",
            description: q
              ? "Try a different name or clear the search."
              : "Add the first owner to get started.",
            action: q
              ? { label: "Clear search", onClick: () => setUrlParams({ q: undefined, page: 1 }) }
              : { label: "Add owner", href: "/vehicle/owners/new" },
          }}
          getRowId={(r) => r.id}
        />
      </div>
    </div>
  );
}