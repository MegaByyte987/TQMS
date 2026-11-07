"use client";

import { PageHeader } from "@/components/layout/page-header";
import { VehicleForm } from "./vehicle-form";
import { useCreateVehicle } from "../hooks/use-vehicle-mutations";

export function NewVehiclePage() {
  const create = useCreateVehicle();

  return (
    <div>
      <PageHeader
        title="Add vehicle"
        description="Register a new vehicle in the fleet."
      />
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <VehicleForm
          mode="create"
          onSubmit={(values) => create.mutate(values)}
          isPending={create.isPending}
          cancelHref="/vehicle/vehicles"
        />
      </div>
    </div>
  );
}