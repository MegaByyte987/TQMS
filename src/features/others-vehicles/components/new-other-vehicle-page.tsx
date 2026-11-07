"use client";

import { PageHeader } from "@/components/layout/page-header";
import { OtherVehicleForm } from "./others-vehicle-form";
import { useCreateOtherVehicle } from "../hooks/use-other-vehicle-mutations";

export function NewOtherVehiclePage() {
  const create = useCreateOtherVehicle();

  return (
    <div>
      <PageHeader
        title="Add other vehicle"
        description="Register a non-registered or third-party vehicle."
      />
      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-6">
        <OtherVehicleForm
          mode="create"
          onSubmit={(values) => create.mutate(values)}
          isPending={create.isPending}
          cancelHref="/vehicle/others"
        />
      </div>
    </div>
  );
}