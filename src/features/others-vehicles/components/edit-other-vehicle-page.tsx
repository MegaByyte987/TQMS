"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { OtherVehicleForm } from "./others-vehicle-form";
import { useOtherVehicle } from "../hooks/use-others-vehicles";
import { useUpdateOtherVehicle } from "../hooks/use-other-vehicle-mutations";

export function EditOtherVehiclePage({ vehicleId }: { vehicleId: string }) {
  const query = useOtherVehicle(vehicleId);
  const update = useUpdateOtherVehicle();

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-56 rounded-[8px]" />
        <Skeleton className="h-48 w-full rounded-[12px]" />
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  }

  const entry = query.data.data;

  return (
    <div>
      <PageHeader
        title={`Edit — ${entry.formatedNo}`}
        description="Changing the type re-derives the formatted number."
      />
      <div className="max-w-md rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-6">
        <OtherVehicleForm
          mode="edit"
          initial={entry}
          onSubmit={(values) =>
            update.mutate({ id: entry.id, body: values })
          }
          isPending={update.isPending}
          cancelHref={`/vehicle/others/${entry.id}`}
        />
      </div>
    </div>
  );
}