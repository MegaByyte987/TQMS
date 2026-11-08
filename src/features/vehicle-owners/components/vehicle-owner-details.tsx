"use client";

import Link from "next/link";
import { Pencil, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { DetailList } from "@/components/shared/detail-list";
import { ErrorState } from "@/components/shared/error-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useVehicleOwner } from "../hooks/use-vehicle-owners";
import { useLookup } from "@/lib/use-lookup";
import { orDash } from "@/lib/formatters";
import { displayBS } from "@/lib/bs-date";

interface Props {
  ownerId: string;
}

export function VehicleOwnerDetails({ ownerId }: Props) {
  const query = useVehicleOwner(ownerId);
  const statesQuery = useLookup("states");

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-3">
        <Skeleton className="h-8 w-40 rounded-[8px]" />
        <Skeleton className="h-3 w-64 rounded-[8px]" />
        <Skeleton className="h-64 w-full rounded-[12px]" />
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  }

  const owner = query.data.data;
  const stateName =
    statesQuery.data?.find((s) => s.value === owner.stateId)?.label ?? owner.stateId;

  return (
    <div>
      <PageHeader
        title={owner.name}
        description={`Owner since ${displayBS(owner.createdAtBS)}`}
        actions={
          <>
            <Button asChild variant="outline">
              <Link href="/vehicle/owners">
                <ArrowLeft className="size-4" aria-hidden="true" />
                Back
              </Link>
            </Button>
            <Button asChild>
              <Link href={`/vehicle/owners/${owner.id}/edit`}>
                <Pencil className="size-4" aria-hidden="true" />
                Edit
              </Link>
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-4 lg:col-span-2">
          <h2 className="mb-3 text-sm font-semibold tracking-[-0.015em] text-[var(--color-fg)]">
            Owner details
          </h2>
          <DetailList
            rows={[
              { label: "Name", value: owner.name },
              { label: "Type", value: owner.isIndividual ? "Individual" : "Company" },
              { label: "State", value: stateName },
              { label: "District", value: owner.districtId },
              { label: "Local level", value: orDash(owner.localLevel) },
              { label: "Street", value: orDash(owner.streetAddress) },
              { label: "Email", value: orDash(owner.email) },
              { label: "PAN", value: orDash(owner.panNumber) },
              { label: "Phone", value: owner.phoneNumber },
            ]}
          />
        </div>

        <div className="flex flex-col gap-4">
          {owner.contactPerson && (
            <div className="rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-4">
              <h2 className="mb-3 text-sm font-semibold tracking-[-0.015em] text-[var(--color-fg)]">
                Contact person
              </h2>
              <DetailList
                rows={[
                  { label: "Name", value: owner.contactPerson.name },
                  { label: "Phone", value: owner.contactPerson.phone },
                  { label: "Email", value: orDash(owner.contactPerson.email) },
                ]}
              />
            </div>
          )}

          {owner.registration && (
            <div className="rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-4">
              <h2 className="mb-3 text-sm font-semibold tracking-[-0.015em] text-[var(--color-fg)]">
                Registration
              </h2>
              <DetailList
                rows={[
                  { label: "Number", value: orDash(owner.registration.number) },
                  {
                    label: "Document",
                    value: owner.registration.documentUrl ? (
                      <a
                        href={owner.registration.documentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[var(--color-pri)] hover:underline"
                      >
                        View
                      </a>
                    ) : (
                      "(not uploaded)"
                    ),
                  },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}