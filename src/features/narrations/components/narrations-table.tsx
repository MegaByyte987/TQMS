"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { DataTable } from "@/components/shared/data-table/data-table";
import { RowActions } from "@/components/shared/data-table/row-actions";
import { useNarrations } from "../hooks/use-narrations";
import { NarrationEditDialog } from "./narration-edit-dialog";
import type { Narration } from "../types";
import { displayBS } from "@/lib/bs-date";

export function NarrationsTable() {
  const [editing, setEditing] = useState<Narration | null>(null);
  const query = useNarrations({ pageSize: 100 });

  const columns: ColumnDef<Narration, unknown>[] = [
    {
      accessorKey: "s-n",
      header: "S.N",
      meta: { align: "right" },
      cell: ({ row }) => (
        <span className="tabular-nums text-[var(--color-mut)]">
          {row.original["s-n"]}
        </span>
      ),
    },
    {
      accessorKey: "text",
      header: "Narration",
    },
    {
      accessorKey: "updatedAtBS",
      header: "Updated",
      cell: ({ row }) => displayBS(row.original.updatedAtBS),
    },
    {
      id: "actions",
      header: "",
      meta: { align: "right" },
      cell: ({ row }) => (
        <RowActions onEdit={() => setEditing(row.original)} />
      ),
    },
  ];

  const meta =
    query.data?.meta ?? { page: 1, pageSize: 100, total: 0, totalPages: 1 };

  return (
    <div>
      <PageHeader
        title="Narration"
        description="Reusable narration strings. Managed by an administrator; edit only."
      />
      <div className="mb-4 rounded-[8px] border border-[var(--color-warnw)] bg-[var(--color-warnw)] px-3 py-2 text-sm text-[var(--color-warn)]">
        Narrations are seeded by the administrator. You can edit existing
        entries but cannot create new ones.
      </div>
      <DataTable<Narration>
        columns={columns}
        data={query.data?.data ?? []}
        isLoading={query.isPending}
        isError={query.isError}
        error={query.error}
        onRetry={() => query.refetch()}
        pagination={meta}
        onPageChange={() => {}}
        onPageSizeChange={() => {}}
        emptyState={{
          title: "No narrations",
          description: "Narrations are seeded by the administrator.",
        }}
        getRowId={(r) => r.id}
      />
      <NarrationEditDialog
        narration={editing}
        onClose={() => setEditing(null)}
      />
    </div>
  );
}