"use client";

import Link from "next/link";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DetailList } from "@/components/shared/detail-list";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useOtherVehicle } from "../hooks/use-others-vehicles";
import { useLookup } from "@/lib/use-lookup";
import { displayBS } from "@/lib/bs-date";

interface Props {
  vehicleId: string;
}

export function OtherVehicleDetails({ vehicleId }: Props) {
  const query = useOtherVehicle(vehicleId);
  const plateTypesQuery = useLookup("plate-types");
  const othersTypesQuery = useLookup("others-types");

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  }

  const entry = query.data.data;
  const plateTypeName =
    plateTypesQuery.data?.find((p) => p.value === entry.plateTypeId)?.label ??
    entry.plateTypeId;
  const othersTypeName =
    othersTypesQuery.data?.find((o) => o.value === entry.othersTypeId)?.label ??
    entry.othersTypeId;

  return (
    <div>
      <PageHeader
        title={entry.formatedNo}
        description={`Registered ${displayBS(entry.createdAtBS)}`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/vehicle/others">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/vehicle/others/${entry.id}/edit`}>
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </Link>
            </Button>
          </>
        }
      />

      <div className="max-w-md rounded-lg border border-slate-200 bg-white p-4">
        <DetailList
          rows={[
            { label: "Formatted no.", value: entry.formatedNo },
            { label: "Number type", value: entry.numberType },
            { label: "Others type", value: othersTypeName },
            { label: "Plate type", value: plateTypeName },
          ]}
        />
      </div>
    </div>
  );
}