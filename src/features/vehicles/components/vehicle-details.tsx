"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DetailList } from "@/components/shared/detail-list";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicle } from "../hooks/use-vehicles";
import { useLookup } from "@/lib/use-lookup";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { orDash } from "@/lib/formatters";
import { displayBS } from "@/lib/bs-date";

interface Props {
  vehicleId: string;
}

export function VehicleDetails({ vehicleId }: Props) {
  const query = useVehicle(vehicleId);
  const typesQuery = useLookup("vehicle-types");
  const colorsQuery = useLookup("plate-colors");
  const plateTypesQuery = useLookup("plate-types");
  const sthaniyaQuery = useLookup("sthaniya-sangh");

  const ownersQuery = useQuery({
    queryKey: ["vehicle-owners", "lookup"],
    queryFn: async () => {
      const res = await api.get<{ id: string; name: string }[]>(
        "/vehicle-owners?pageSize=100"
      );
      return res.data;
    },
    staleTime: 60_000,
  });

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-3 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  }

  const vehicle = query.data.data;
  const ownerName =
    ownersQuery.data?.find((o) => o.id === vehicle.ownerId)?.name ??
    vehicle.ownerId;
  const typeName =
    typesQuery.data?.find((t) => t.value === vehicle.vehicleTypeId)?.label ??
    vehicle.vehicleTypeId;
  const colorName =
    colorsQuery.data?.find((c) => c.value === vehicle.plateColorId)?.label ??
    vehicle.plateColorId;
  const plateTypeName =
    plateTypesQuery.data?.find((p) => p.value === vehicle.plateTypeId)?.label ??
    vehicle.plateTypeId;
  const sthaniyaName =
    sthaniyaQuery.data?.find((s) => s.value === vehicle.sthaniyaSanghId)
      ?.label ?? vehicle.sthaniyaSanghId;

  return (
    <div>
      <PageHeader
        title={vehicle.plateNo}
        description={`Registered ${displayBS(vehicle.createdAtBS)}`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/vehicle/vehicles">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/vehicle/vehicles/${vehicle.id}/edit`}>
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-slate-200 bg-white p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Registration
          </h2>
          <DetailList
            rows={[
              { label: "Plate no.", value: vehicle.plateNo },
              { label: "Vehicle no.", value: vehicle.vehicleNumber },
              { label: "Lot no.", value: orDash(vehicle.lotNo) },
              { label: "Type", value: typeName },
              { label: "Owner", value: ownerName },
              { label: "Sthaniyasangh", value: sthaniyaName },
              { label: "Plate color", value: colorName },
              { label: "Plate type", value: plateTypeName },
            ]}
          />
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-sm font-semibold text-slate-900">
            Vehicle details
          </h2>
          <DetailList
            rows={[
              { label: "Company", value: orDash(vehicle.companyName) },
              { label: "Model", value: orDash(vehicle.modelNo) },
              { label: "Engine", value: orDash(vehicle.engineNumber) },
              { label: "Chassis", value: orDash(vehicle.chassisNumber) },
            ]}
          />
        </div>
      </div>
    </div>
  );
}