"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table/data-table";
import { FilterBar } from "@/components/shared/filter-bar";
import { useCheckpointEntryReport } from "../hooks/use-reports";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { formatCurrency } from "@/lib/formatters";
import { displayBS, todayBS } from "@/lib/bs-date";
import type { CheckpointEntryRow } from "../types";

function clampPage(v: number): number {
  return Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1;
}

export function CheckpointEntryReport() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId") ?? "";
  const fromBS = searchParams.get("fromBS") ?? todayBS();
  const toBS = searchParams.get("toBS") ?? todayBS();
  const page = clampPage(Number(searchParams.get("page") ?? "1"));
  const pageSize = 25;

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

  const usersQuery = useQuery({
    queryKey: ["check-users", "lookup"],
    queryFn: async () => {
      const res = await api.get<{ id: string; name: string }[]>("/check-users?pageSize=100");
      return res.data;
    },
    staleTime: 60_000,
  });

  const reportQuery = useCheckpointEntryReport({
    userId: userId || undefined,
    fromBS,
    toBS,
    page,
    pageSize,
  });

  const columns: ColumnDef<CheckpointEntryRow, unknown>[] = [
    { accessorKey: "s-n", header: "S.N", meta: { align: "right" } },
    { accessorKey: "sthaniyaSangh", header: "Sthaniya Sangh" },
    { accessorKey: "checkpoint", header: "Checkpoint" },
    { accessorKey: "checkpointUser", header: "Checkpoint User" },
    {
      accessorKey: "entryDateBS",
      header: "Entry date",
      cell: ({ row }) => displayBS(row.original.entryDateBS),
    },
    {
      accessorKey: "totalVehicle",
      header: "Total vehicle",
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums text-[var(--color-fg)]">{row.original.totalVehicle}</span>
      ),
    },
    {
      accessorKey: "totalAmount",
      header: "Total amount",
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums text-[var(--color-fg)]">
          {formatCurrency(row.original.totalAmount)}
        </span>
      ),
    },
  ];

  const meta = reportQuery.data?.meta ?? { page: 1, pageSize, total: 0, totalPages: 1 };

  return (
    <div>
      <PageHeader
        title="Checkpoint Entry"
        description="Daily summary of activity per checkpoint user."
      />

      <div className="flex flex-col gap-4">
        <FilterBar
          onClear={() =>
            setUrlParams({ userId: undefined, fromBS: todayBS(), toBS: todayBS(), page: 1 })
          }
        >
          <div className="flex flex-col gap-1.5">
            <Label className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-mut)]">User</Label>
            <Select
              value={userId || "all"}
              onValueChange={(v) =>
                setUrlParams({ userId: v === "all" ? undefined : v, page: 1 })
              }
            >
              <SelectTrigger className="h-[38px] w-52 rounded-[8px] border-[var(--color-bd)] bg-[var(--color-card)] text-[14px] text-[var(--color-fg)] focus:ring-[#6d8bff]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="rounded-[8px] border-[var(--color-bd)] bg-[var(--color-card)] text-[var(--color-fg)]">
                <SelectItem value="all">All users</SelectItem>
                {(usersQuery.data ?? []).map((u) => (
                  <SelectItem key={u.id} value={u.id}>
                    {u.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="from-date" className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-mut)]">From</Label>
            <Input
              id="from-date"
              value={fromBS}
              onChange={(e) =>
                setUrlParams({ fromBS: e.target.value || undefined, page: 1 })
              }
              placeholder="2083-07-20"
              className="h-[38px] w-32 rounded-[8px] border-[var(--color-bd)] bg-[var(--color-card)] text-[14px] text-[var(--color-fg)]"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="to-date" className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-mut)]">To</Label>
            <Input
              id="to-date"
              value={toBS}
              onChange={(e) =>
                setUrlParams({ toBS: e.target.value || undefined, page: 1 })
              }
              placeholder="2083-07-20"
              className="h-[38px] w-32 rounded-[8px] border-[var(--color-bd)] bg-[var(--color-card)] text-[14px] text-[var(--color-fg)]"
            />
          </div>
        </FilterBar>

        <div className="overflow-hidden rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)]">
          <DataTable<CheckpointEntryRow>
            columns={columns}
            data={reportQuery.data?.data ?? []}
            isLoading={reportQuery.isPending}
            isError={reportQuery.isError}
            error={reportQuery.error}
            onRetry={() => reportQuery.refetch()}
            pagination={meta}
            onPageChange={(p) => setUrlParams({ page: p })}
            onPageSizeChange={() => {}}
            emptyState={{
              title: "No activity in this range",
              description:
                "Try widening the date range or clearing the user filter.",
            }}
            getRowId={(r) => r.id}
          />
        </div>
      </div>
    </div>
  );
}