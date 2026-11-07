"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { ColumnDef, SortingState } from "@tanstack/react-table";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { PageHeader } from "@/components/layout/page-header";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { DataTable } from "@/components/shared/data-table/data-table";
import { ColumnHeader } from "@/components/shared/data-table/column-header";
import { RowActions } from "@/components/shared/data-table/row-actions";
import { FilterBar } from "@/components/shared/filter-bar";
import { SearchInput } from "@/components/shared/search-input";
import { StatusBadge } from "@/components/shared/status-badge";
import { CheckUserDetails } from "./check-user-details";
import { CheckUserForm } from "./check-user-form";
import {
  useCheckUsers,
} from "../hooks/use-check-users";
import {
  useCreateCheckUser,
  useDeleteCheckUser,
  useUpdateCheckUser,
} from "../hooks/use-check-user-mutations";
import type { CheckUser } from "../types";
import type { CheckUserFormValues } from "../schemas";
import { formatPhone, orDash } from "@/lib/formatters";
import type { Updater } from "@tanstack/react-table";

type FormState =
  | { mode: "create" }
  | { mode: "edit"; user: CheckUser }
  | null;

const SORTABLE = new Set(["sn", "name"]);

function clampPage(value: number): number {
  return Number.isFinite(value) && value >= 1 ? Math.floor(value) : 1;
}

function clampPageSize(value: number): number {
  if (!Number.isFinite(value)) return 25;
  return [10, 25, 50, 100].includes(value) ? value : 25;
}

export function CheckUsersTable() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") ?? "";
  const page = clampPage(Number(searchParams.get("page") ?? "1"));
  const pageSize = clampPageSize(Number(searchParams.get("pageSize") ?? "25"));
  const rawSort = searchParams.get("sort") ?? "sn";
  const sort = SORTABLE.has(rawSort) ? rawSort : "sn";
  const order = searchParams.get("order") === "desc" ? "desc" : "asc";

  const query = useCheckUsers({ q, page, pageSize, sort, order });

  const [formState, setFormState] = useState<FormState>(null);
  const [viewUser, setViewUser] = useState<CheckUser | null>(null);
  const [deleteUser, setDeleteUser] = useState<CheckUser | null>(null);

  const createMutation = useCreateCheckUser();
  const updateMutation = useUpdateCheckUser();
  const deleteMutation = useDeleteCheckUser();

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

  // If a filter change leaves the current page past the last page, snap to 1.
  useEffect(() => {
    if (
      query.data &&
      query.data.data.length === 0 &&
      query.data.meta &&
      query.data.meta.total > 0 &&
      page > 1
    ) {
      setUrlParams({ page: 1 });
    }
  }, [query.data, page, setUrlParams]);

  const columns = useMemo<ColumnDef<CheckUser, unknown>[]>(
    () => [
      {
        accessorKey: "sn",
        header: ({ column }) => <ColumnHeader column={column} title="S.N" />,
        meta: { align: "right" },
        cell: ({ row }) => (
          <span className="tabular-nums text-slate-500">
            {row.original["sn"]}
          </span>
        ),
      },
      {
        accessorKey: "name",
        header: ({ column }) => <ColumnHeader column={column} title="Name" />,
      },
      {
        accessorKey: "streetAddress",
        header: "Address",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="text-slate-600">{orDash(row.original.streetAddress)}</span>
        ),
      },
      {
        accessorKey: "mobileNumber",
        header: "Contact",
        enableSorting: false,
        cell: ({ row }) => (
          <span className="tabular-nums">{formatPhone(row.original.mobileNumber)}</span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        enableSorting: false,
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
            onView={() => setViewUser(row.original)}
            onEdit={() => setFormState({ mode: "edit", user: row.original })}
            onDelete={() => setDeleteUser(row.original)}
          />
        ),
      },
    ],
    []
  );

  const sorting: SortingState = [{ id: sort, desc: order === "desc" }];

  const onSortingChange = (updater: Updater<SortingState>) => {
  const next = typeof updater === "function" ? updater(sorting) : updater;
  const first = next[0];
  if (!first) {
    setUrlParams({ sort: undefined, order: undefined, page: 1 });
  } else {
    setUrlParams({
      sort: first.id,
      order: first.desc ? "desc" : "asc",
      page: 1,
    });
  }
};

  const onSubmit = (values: CheckUserFormValues) => {
    if (formState?.mode === "edit") {
      updateMutation.mutate(
        { id: formState.user.id, body: values },
        { onSuccess: () => setFormState(null) }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => setFormState(null),
      });
    }
  };

  const onConfirmDelete = () => {
    if (!deleteUser) return;
    deleteMutation.mutate(deleteUser.id, {
      onSuccess: () => setDeleteUser(null),
    });
  };

  const rows = query.data?.data ?? [];
  const meta = query.data?.meta ?? {
    page: 1,
    pageSize,
    total: 0,
    totalPages: 1,
  };

  return (
    <div>
      <PageHeader
        title="Check User"
        description="Staff accounts that operate a checkpoint."
        actions={
          <Button onClick={() => setFormState({ mode: "create" })}>
            <Plus className="size-4" aria-hidden="true" />
            Add user
          </Button>
        }
      />

      <div className="flex flex-col gap-4">
        <FilterBar
          onClear={() => setUrlParams({ q: undefined, page: 1 })}
        >
          <SearchInput
            value={q}
            onChange={(value) =>
              setUrlParams({ q: value || undefined, page: 1 })
            }
            placeholder="Search by name…"
          />
        </FilterBar>

        <DataTable<CheckUser>
          columns={columns}
          data={rows}
          isLoading={query.isPending}
          isError={query.isError}
          error={query.error}
          onRetry={() => query.refetch()}
          sorting={sorting}
          onSortingChange={onSortingChange}
          pagination={meta}
          onPageChange={(next) => setUrlParams({ page: next })}
          onPageSizeChange={(size) =>
            setUrlParams({ pageSize: size, page: 1 })
          }
          emptyState={{
            title: q ? "No users match your search" : "No check users yet",
            description: q
              ? "Try a different name or clear the search."
              : "Add the first checkpoint user to get started.",
            action: q
              ? {
                  label: "Clear search",
                  onClick: () => setUrlParams({ q: undefined, page: 1 }),
                }
              : {
                  label: "Add user",
                  onClick: () => setFormState({ mode: "create" }),
                },
          }}
          getRowId={(user) => user.id}
        />
      </div>

      <Drawer
        open={formState !== null}
        onOpenChange={(open) => !open && setFormState(null)}
      >
        <DrawerContent side="right" className="max-w-xl">
          <DrawerHeader>
            <DrawerTitle>
              {formState?.mode === "edit" ? "Edit user" : "Add user"}
            </DrawerTitle>
            <DrawerDescription>
              {formState?.mode === "edit"
                ? "Update the details of this staff account."
                : "Create a new staff account for a checkpoint."}
            </DrawerDescription>
          </DrawerHeader>
          {formState && (
            <CheckUserForm
              key={
                formState.mode === "edit"
                  ? `edit-${formState.user.id}`
                  : "create"
              }
              mode={formState.mode}
              initial={
                formState.mode === "edit" ? formState.user : undefined
              }
              onSubmit={onSubmit}
              isPending={
                createMutation.isPending || updateMutation.isPending
              }
            />
          )}
        </DrawerContent>
      </Drawer>

      <CheckUserDetails user={viewUser} onClose={() => setViewUser(null)} />

      <ConfirmDialog
        open={Boolean(deleteUser)}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        title="Delete this user?"
        description={
          <>
            <strong>{deleteUser?.name}</strong> will be permanently removed.
            This action cannot be undone.
          </>
        }
        confirmLabel="Delete"
        variant="destructive"
        isPending={deleteMutation.isPending}
        onConfirm={onConfirmDelete}
      />
    </div>
  );
}