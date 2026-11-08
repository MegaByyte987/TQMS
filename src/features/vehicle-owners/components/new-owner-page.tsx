"use client";

import { PageHeader } from "@/components/layout/page-header";
import { VehicleOwnerForm } from "./vehicle-owner-form";
import { useCreateVehicleOwner } from "../hooks/use-vehicle-owner-mutations";

export function NewVehicleOwnerPage() {
  const create = useCreateVehicleOwner();

  return (
    <div>
      <PageHeader
        title="Add vehicle owner"
        description="Create a new owner or company record."
      />
      <div className="rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-6">
        <VehicleOwnerForm
          mode="create"
          onSubmit={(values) => create.mutate(values)}
          isPending={create.isPending}
          cancelHref="/vehicle/owners"
        />
      </div>
    </div>
  );
}