"use client";

import { useCallback, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef } from "@tanstack/react-table";
import { Download, Printer } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table/data-table";
import { FilterBar } from "@/components/shared/filter-bar";
import { useDetailEntryReport } from "../hooks/use-reports";
import { reportsApi } from "../api";
import { useToast } from "@/providers/toast-provider";
import { formatWeight } from "@/lib/formatters";
import { displayBS, todayBS } from "@/lib/bs-date";
import type { DetailEntryRow } from "../types";

function clampPage(v: number): number {
  return Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1;
}

export function DetailEntryReport() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const [exporting, setExporting] = useState(false);

  // Widen the default range so seed data and recent entries are visible immediately
  const fromBS = searchParams.get("fromBS") ?? "2083-07-01";
  const toBS = searchParams.get("toBS") ?? todayBS();
  const vehicleNo = searchParams.get("vehicleNo") ?? "";
  const goods = searchParams.get("goods") ?? "";
  const billNo = searchParams.get("billNo") ?? "";
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

  const query = useDetailEntryReport({
    fromBS,
    toBS,
    vehicleNo: vehicleNo || undefined,
    goods: goods || undefined,
    billNo: billNo || undefined,
    page,
    pageSize,
  });

  const filters = {
    fromBS,
    toBS,
    vehicleNo: vehicleNo || undefined,
    goods: goods || undefined,
    billNo: billNo || undefined,
  };

  const onExport = async () => {
    setExporting(true);
    try {
      const res = await fetch(reportsApi.detailEntryExportUrl(filters), {
        credentials: "include",
      });
      if (!res.ok) {
        toast("error", "Export failed. Try again.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `detail-entry-${fromBS}-${toBS}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast("success", "Report exported.");
    } catch {
      toast("error", "Network error while exporting.");
    } finally {
      setExporting(false);
    }
  };

  const columns: ColumnDef<DetailEntryRow, unknown>[] = [
    { 
      accessorKey: "s-n", 
      header: "S.N", 
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums text-[var(--color-mut)]">{row.original["s-n"]}</span>
      ),
    },
    { 
      accessorKey: "dateTime", 
      header: "Date & time",
      cell: ({ row }) => (
        <span className="text-[var(--color-fg)]">{row.original.dateTime}</span>
      ),
    },
    { 
      accessorKey: "receiptNo", 
      header: "Receipt no.", 
      cell: ({ row }) => (
        <span className="font-mono text-[var(--color-fg)]">{row.original.receiptNo}</span>
      ),
    },
    { 
      accessorKey: "vehicleNo", 
      header: "Vehicle no.",
      cell: ({ row }) => (
        <span className="text-[var(--color-fg)]">{row.original.vehicleNo}</span>
      ),
    },
    { 
      accessorKey: "vehicleType", 
      header: "Vehicle type",
      cell: ({ row }) => (
        <span className="text-[var(--color-fg)]">{row.original.vehicleType}</span>
      ),
    },
    { 
      accessorKey: "checkpointName", 
      header: "Checkpoint",
      cell: ({ row }) => (
        <span className="text-[var(--color-fg)]">{row.original.checkpointName}</span>
      ),
    },
    { 
      accessorKey: "route", 
      header: "From → to",
      cell: ({ row }) => (
        <span className="text-[var(--color-fg)]">{row.original.route}</span>
      ),
    },
    {
      accessorKey: "grossWeightKg",
      header: "Gross weight",
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums text-[var(--color-fg)]">{formatWeight(row.original.grossWeightKg)}</span>
      ),
    },
    { 
      accessorKey: "material", 
      header: "Material",
      cell: ({ row }) => (
        <span className="text-[var(--color-fg)]">{row.original.material}</span>
      ),
    },
    { 
      accessorKey: "remarks", 
      header: "Remarks",
      cell: ({ row }) => (
        <span className="text-[var(--color-mut)]">{row.original.remarks}</span>
      ),
    },
  ];

  const meta = query.data?.meta ?? { page: 1, pageSize, total: 0, totalPages: 1 };

  return (
    <div>
      <PageHeader
        title="Detail Entry Report"
        description="Line items of every journey event in the selected range."
        actions={
          <>
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="size-4" aria-hidden="true" />
              Print
            </Button>
            <Button onClick={onExport} disabled={exporting || !query.data?.data.length}>
              <Download className="size-4" aria-hidden="true" />
              {exporting ? "Exporting…" : "Export Excel"}
            </Button>
          </>
        }
      />

      <div className="flex flex-col gap-4">
        <FilterBar
          onClear={() =>
            setUrlParams({
              fromBS: "2083-07-01",
              toBS: todayBS(),
              vehicleNo: undefined,
              goods: undefined,
              billNo: undefined,
              page: 1,
            })
          }
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="det-from" className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-mut)]">From</Label>
            <Input
              id="det-from"
              value={fromBS}
              onChange={(e) => setUrlParams({ fromBS: e.target.value || undefined, page: 1 })}
              placeholder="2083-07-01"
              className="h-[38px] w-32 rounded-[8px] border-[var(--color-bd)] bg-[var(--color-card)] text-[14px] text-[var(--color-fg)]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="det-to" className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-mut)]">To</Label>
            <Input
              id="det-to"
              value={toBS}
              onChange={(e) => setUrlParams({ toBS: e.target.value || undefined, page: 1 })}
              placeholder="2083-07-30"
              className="h-[38px] w-32 rounded-[8px] border-[var(--color-bd)] bg-[var(--color-card)] text-[14px] text-[var(--color-fg)]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="det-vehicle" className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-mut)]">Vehicle no.</Label>
            <Input
              id="det-vehicle"
              value={vehicleNo}
              onChange={(e) => setUrlParams({ vehicleNo: e.target.value || undefined, page: 1 })}
              placeholder="BA 1 KHA 1234"
              className="h-[38px] w-40 rounded-[8px] border-[var(--color-bd)] bg-[var(--color-card)] text-[14px] text-[var(--color-fg)]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="det-goods" className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-mut)]">Goods</Label>
            <Input
              id="det-goods"
              value={goods}
              onChange={(e) => setUrlParams({ goods: e.target.value || undefined, page: 1 })}
              placeholder="Gravel"
              className="h-[38px] w-32 rounded-[8px] border-[var(--color-bd)] bg-[var(--color-card)] text-[14px] text-[var(--color-fg)]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="det-bill" className="text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-mut)]">Bill no.</Label>
            <Input
              id="det-bill"
              value={billNo}
              onChange={(e) => setUrlParams({ billNo: e.target.value || undefined, page: 1 })}
              placeholder="INX_2083_0001"
              className="h-[38px] w-36 rounded-[8px] border-[var(--color-bd)] bg-[var(--color-card)] font-mono text-[12px] text-[var(--color-fg)]"
            />
          </div>
        </FilterBar>

        <DataTable<DetailEntryRow>
          columns={columns}
          data={query.data?.data ?? []}
          isLoading={query.isPending}
          isError={query.isError}
          error={query.error}
          onRetry={() => query.refetch()}
          pagination={meta}
          onPageChange={(p) => setUrlParams({ page: p })}
          onPageSizeChange={() => {}}
          emptyState={{
            title: "No entries in this range",
            description: "Widen the date range or clear the filters.",
          }}
          getRowId={(r) => r.id}
        />
      </div>
    </div>
  );
}