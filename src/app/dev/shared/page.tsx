"use client";

import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table/data-table";
import { ColumnHeader } from "@/components/shared/data-table/column-header";
import { RowActions } from "@/components/shared/data-table/row-actions";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { FilterBar } from "@/components/shared/filter-bar";
import { SearchInput } from "@/components/shared/search-input";
import { StatCard } from "@/components/shared/stat-card";
import { StatusBadge } from "@/components/shared/status-badge";
import {
  TextField,
  SelectField,
  DateBSField,
  FileField,
  ToggleField,
} from "@/components/shared/form-field";
import { useToast } from "@/providers/toast-provider";
import { formatCurrency } from "@/lib/formatters";
import { isBSDate } from "@/lib/bs-date";

// ---------------------------------------------------------------------------
// Demo data and schema
// ---------------------------------------------------------------------------

interface DemoUser {
  id: string;
  name: string;
  phone: string;
  status: boolean;
}

const demoUsers: DemoUser[] = Array.from({ length: 42 }, (_, i) => ({
  id: `u-${i + 1}`,
  name: `Staff Member ${String(i + 1).padStart(2, "0")}`,
  phone: `98410${String(10000 + i).slice(-5)}`,
  status: i % 4 !== 0,
}));

const demoFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  state: z.string().min(1, "State is required."),
  // Wrapped in an arrow function returning `boolean` so Zod does NOT use
  // the type-guard overload. This keeps the schema's input and output types
  // identical (`string`), so `defaultValues`, `useForm`, and `handleSubmit`
  // all agree on `DemoFormValues`.
  entryDate: z
    .string()
    .refine((v): boolean => isBSDate(v), "Enter a valid BS date (YYYY-MM-DD)."),
  isIndividual: z.boolean(),
  logo: z.instanceof(File).nullable().optional(),
});
type DemoFormValues = z.infer<typeof demoFormSchema>;

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function SharedDemoPage() {
  const { toast } = useToast();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<DemoFormValues>({
    resolver: zodResolver(demoFormSchema),
    defaultValues: {
      name: "",
      state: "",
      entryDate: "",
      isIndividual: false,
      logo: null,
    },
  });

  const onSubmit = (values: DemoFormValues) => {
    // Narrow at the point of use if you need the `BSDate` type here.
    if (!isBSDate(values.entryDate)) return;
    toast("success", `Form valid. Name: ${values.name}, date: ${values.entryDate}`);
    reset();
  };

  // -------------------------------------------------------------------------
  // Sort + paginate the demo data client-side.
  //
  // In Phase 6+, this work happens in the mock API and the hook returns
  // { rows, meta }. The DataTable component is exercised identically in
  // both cases — that is the point of `manualSorting` / `manualPagination`.
  // -------------------------------------------------------------------------
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return demoUsers;
    return demoUsers.filter((u) => u.name.toLowerCase().includes(q));
  }, [search]);

  const visibleRows = useMemo(() => {
    const sorted = [...filtered];

    if (sorting.length > 0) {
      const [{ id, desc }] = sorting;
      if (id === "name" || id === "phone") {
        sorted.sort((a, b) => {
          const av = a[id];
          const bv = b[id];
          const cmp = av < bv ? -1 : av > bv ? 1 : 0;
          return desc ? -cmp : cmp;
        });
      }
    }

    const start = (page - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [filtered, sorting, page, pageSize]);

  const totalPages = Math.max(Math.ceil(filtered.length / pageSize), 1);

  // -------------------------------------------------------------------------
  // Table columns
  // -------------------------------------------------------------------------
  const columns: ColumnDef<DemoUser, unknown>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <ColumnHeader column={column} title="Name" />,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <ColumnHeader column={column} title="Phone" />,
    },
    {
      accessorKey: "status",
      header: "Status",
      meta: { align: "center" },
      cell: ({ row }) => (
        <StatusBadge
          label={row.original.status ? "Active" : "Inactive"}
          variant={row.original.status ? "success" : "muted"}
        />
      ),
    },
    {
      id: "actions",
      header: "",
      meta: { align: "right" },
      cell: ({ row }) => (
        <RowActions
          onView={() => toast("info", `View ${row.original.name}`)}
          onEdit={() => toast("info", `Edit ${row.original.name}`)}
          onDelete={() => setConfirmOpen(true)}
        />
      ),
    },
  ];

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 p-6">
      <PageHeader
        title="Shared components"
        description="Phase 5 smoke test. Every component is interactive, keyboard-accessible, and theme-consistent."
      />

      {/* Stat cards */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Stat cards
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <StatCard label="Total Vehicle" value={142} hint="Today" />
          <StatCard label="Total Amount" value={formatCurrency(45200)} />
          <StatCard label="In Job" value={7} />
        </div>
      </section>

      {/* Status badges */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Status badges
        </h2>
        <div className="flex flex-wrap gap-2">
          <StatusBadge label="Active" variant="success" />
          <StatusBadge label="Inactive" variant="muted" />
          <StatusBadge label="In Queue" variant="info" />
          <StatusBadge label="In Job" variant="success" />
          <StatusBadge label="Payment Pending" variant="warning" />
          <StatusBadge label="Unregistered" variant="muted" />
          <StatusBadge label="Closed" variant="secondary" />
        </div>
      </section>

      {/* Filter bar + search + table */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Filter bar + search + table
        </h2>
        <FilterBar
          onClear={() => {
            setSearch("");
            setPage(1);
          }}
        >
          <SearchInput
            value={search}
            onChange={(v) => {
              setSearch(v);
              setPage(1);
            }}
            placeholder="Search by name…"
          />
        </FilterBar>
        <DataTable<DemoUser>
          columns={columns}
          data={visibleRows}
          isLoading={false}
          isError={false}
          sorting={sorting}
          onSortingChange={(next) => {
            setSorting(next);
            setPage(1);
          }}
          pagination={{
            page,
            pageSize,
            total: filtered.length,
            totalPages,
          }}
          onPageChange={setPage}
          onPageSizeChange={(s) => {
            setPageSize(s);
            setPage(1);
          }}
          emptyState={{
            title: search ? "No matches" : "No users yet",
            description: search
              ? `No users match "${search}". Try a different search.`
              : "Add your first checkpoint user to get started.",
            action: search
              ? { label: "Clear search", onClick: () => setSearch("") }
              : {
                  label: "Add user",
                  onClick: () =>
                    toast("info", "Navigates to /checkpoints/users/new"),
                },
          }}
          getRowId={(r) => r.id}
        />
      </section>

      {/* Table states: loading, empty, error */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Table states
        </h2>
        <DataTable<DemoUser>
          columns={columns}
          data={[]}
          isLoading={true}
          isError={false}
          pagination={{ page: 1, pageSize: 25, total: 0, totalPages: 1 }}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          emptyState={{ title: "Loading" }}
        />
        <DataTable<DemoUser>
          columns={columns}
          data={[]}
          isLoading={false}
          isError={false}
          pagination={{ page: 1, pageSize: 25, total: 0, totalPages: 1 }}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          emptyState={{
            title: "Nothing here yet",
            description:
              "Try adjusting your filters or creating a new record.",
          }}
        />
        <DataTable<DemoUser>
          columns={columns}
          data={[]}
          isLoading={false}
          isError={true}
          error={new Error("Could not reach the server.")}
          onRetry={() => toast("info", "Retrying…")}
          pagination={{ page: 1, pageSize: 25, total: 0, totalPages: 1 }}
          onPageChange={() => {}}
          onPageSizeChange={() => {}}
          emptyState={{ title: "—" }}
        />
      </section>

      {/* Standalone empty and error */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Empty and error standalone
        </h2>
        <EmptyState
          title="No narrations"
          description="Narrations are managed by an administrator."
        />
        <ErrorState
          error={new Error("Network unreachable.")}
          onRetry={() => toast("info", "Retrying…")}
        />
      </section>

      {/* Form fields */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Form fields
        </h2>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 sm:grid-cols-2"
        >
          <TextField
            name="name"
            control={control}
            label="Staff name"
            placeholder="Enter name"
            required
          />
          <SelectField
            name="state"
            control={control}
            label="State"
            options={[
              { value: "state-1", label: "Koshi" },
              { value: "state-2", label: "Madhesh" },
              { value: "state-3", label: "Bagmati" },
            ]}
            required
          />
          <DateBSField
            name="entryDate"
            control={control}
            label="Entry date"
            required
            description="BS calendar date, e.g. 2083-07-20"
          />
          <ToggleField
            name="isIndividual"
            control={control}
            label="Is Individual"
            description="When off, contact details become available."
          />
          <div className="sm:col-span-2">
            <FileField
              name="logo"
              control={control}
              label="Logo"
              accept="image/png,image/jpeg"
              description="PNG or JPEG, up to 5 MB."
            />
          </div>
          <div className="sm:col-span-2">
            <Button type="submit" disabled={isSubmitting}>
              Submit
            </Button>
          </div>
        </form>
      </section>

      {/* Confirm dialog */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Confirm dialog
        </h2>
        <Button variant="destructive" onClick={() => setConfirmOpen(true)}>
          Delete record
        </Button>
        <ConfirmDialog
          open={confirmOpen}
          onOpenChange={setConfirmOpen}
          title="Delete this user?"
          description={
            <>
              <strong>Staff Member 03</strong> will be permanently removed. This
              action cannot be undone.
            </>
          }
          confirmLabel="Delete"
          variant="destructive"
          onConfirm={() => {
            setConfirmOpen(false);
            toast("success", "User deleted.");
          }}
        />
      </section>

      {/* Toasts */}
      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Toasts
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button onClick={() => toast("success", "Saved.")}>Success</Button>
          <Button
            variant="destructive"
            onClick={() => toast("error", "Failed.")}
          >
            Error
          </Button>
          <Button variant="outline" onClick={() => toast("info", "Heads up.")}>
            Info
          </Button>
        </div>
      </section>

      {/* Add action (icon + label) */}
      <section>
        <Button
          onClick={() =>
            toast("info", "Navigates to /checkpoints/users/new")
          }
        >
          <Plus className="size-4" aria-hidden="true" />
          Add user
        </Button>
      </section>
    </main>
  );
}