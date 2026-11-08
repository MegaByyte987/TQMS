"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleOwnerForm } from "./vehicle-owner-form";
import { useVehicleOwner } from "../hooks/use-vehicle-owners";
import { useUpdateVehicleOwner } from "../hooks/use-vehicle-owner-mutations";

export function EditVehicleOwnerPage({ ownerId }: { ownerId: string }) {
  const query = useVehicleOwner(ownerId);
  const update = useUpdateVehicleOwner();

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-64 rounded-[8px]" />
        <Skeleton className="h-96 w-full rounded-[12px]" />
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  }

  const owner = query.data.data;

  return (
    <div>
      <PageHeader
        title={`Edit — ${owner.name}`}
        description="Update this owner's record."
      />
      <div className="rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-6">
        <VehicleOwnerForm
          mode="edit"
          initial={owner}
          onSubmit={(values) => update.mutate({ id: owner.id, body: values })}
          isPending={update.isPending}
          cancelHref={`/vehicle/owners/${owner.id}`}
        />
      </div>
    </div>
  );
}