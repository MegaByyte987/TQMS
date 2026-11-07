"use client";

import { PageHeader } from "@/components/layout/page-header";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { VehicleForm } from "./vehicle-form";
import { useVehicle } from "../hooks/use-vehicles";
import { useUpdateVehicle } from "../hooks/use-vehicle-mutations";

export function EditVehiclePage({ vehicleId }: { vehicleId: string }) {
  const query = useVehicle(vehicleId);
  const update = useUpdateVehicle();

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  }

  const vehicle = query.data.data;

  return (
    <div>
      <PageHeader
        title={`Edit — ${vehicle.plateNo}`}
        description="Update this vehicle's registration details."
      />
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <VehicleForm
          mode="edit"
          initial={vehicle}
          onSubmit={(values) =>
            update.mutate({ id: vehicle.id, body: values })
          }
          isPending={update.isPending}
          cancelHref={`/vehicle/vehicles/${vehicle.id}`}
        />
      </div>
    </div>
  );
}