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
import { useVehicles } from "../hooks/use-vehicles";
import { useLookup } from "@/lib/use-lookup";
import { orDash } from "@/lib/formatters";
import type { Vehicle } from "../types";

function clampPage(v: number): number {
  return Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1;
}

function clampPageSize(v: number): number {
  return [10, 25, 50, 100].includes(v) ? v : 25;
}

export function VehiclesTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const page = clampPage(Number(searchParams.get("page") ?? "1"));
  const pageSize = clampPageSize(Number(searchParams.get("pageSize") ?? "25"));
  const rawSort = searchParams.get("sort") ?? "s-n";
  const sort = rawSort === "plateNo" ? "plateNo" : "s-n";
  const order = searchParams.get("order") === "desc" ? "desc" : "asc";

  const query = useVehicles({ q, page, pageSize, sort, order });
  const typesQuery = useLookup("vehicle-types");

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

  const columns: ColumnDef<Vehicle, unknown>[] = [
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
      accessorKey: "plateNo",
      header: ({ column }) => <ColumnHeader column={column} title="Plate No" />,
      cell: ({ row }) => (
        <span className="font-mono text-slate-900">{row.original.plateNo}</span>
      ),
    },
    {
      accessorKey: "lotNo",
      header: "Lot No",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="text-slate-600">{orDash(row.original.lotNo)}</span>
      ),
    },
    {
      accessorKey: "vehicleNumber",
      header: "Vehicle Number",
      enableSorting: false,
      cell: ({ row }) => (
        <span className="tabular-nums text-slate-700">
          {row.original.vehicleNumber}
        </span>
      ),
    },
    {
      id: "vehicleType",
      header: "Vehicle Type",
      enableSorting: false,
      cell: ({ row }) => {
        const type = typesQuery.data?.find(
          (t) => t.value === row.original.vehicleTypeId
        );
        return <span className="text-slate-700">{type?.label ?? "—"}</span>;
      },
    },
    {
      id: "actions",
      header: "",
      meta: { align: "right" },
      cell: ({ row }) => (
        <RowActions
          onView={() => router.push(`/vehicle/vehicles/${row.original.id}`)}
          onEdit={() =>
            router.push(`/vehicle/vehicles/${row.original.id}/edit`)
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
        title="Vehicles"
        description="Registered fleet vehicles."
        actions={
          <Button asChild>
            <Link href="/vehicle/vehicles/new">
              <Plus className="size-4" aria-hidden="true" />
              Add vehicle
            </Link>
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        <FilterBar onClear={() => setUrlParams({ q: undefined, page: 1 })}>
          <SearchInput
            value={q}
            onChange={(v) => setUrlParams({ q: v || undefined, page: 1 })}
            placeholder="Search by plate…"
          />
        </FilterBar>

        <DataTable<Vehicle>
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
            title: q ? "No vehicles match" : "No vehicles registered",
            description: q
              ? "Try a different plate number or clear the search."
              : "Register the first vehicle to get started.",
            action: q
              ? {
                  label: "Clear search",
                  onClick: () => setUrlParams({ q: undefined, page: 1 }),
                }
              : { label: "Add vehicle", href: "/vehicle/vehicles/new" },
          }}
          getRowId={(v) => v.id}
        />
      </div>
    </div>
  );
}