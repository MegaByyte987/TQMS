"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/shared/form-section";
import { TextField, SelectField } from "@/components/shared/form-field";
import { useLookup } from "@/lib/use-lookup";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/fetcher";
import { vehicleFormSchema, type VehicleFormValues } from "../schemas";
import type { Vehicle } from "../types";

interface Props {
  mode: "create" | "edit";
  initial?: Vehicle;
  onSubmit: (values: VehicleFormValues) => void;
  isPending: boolean;
  cancelHref: string;
}

export function VehicleForm({
  mode,
  initial,
  onSubmit,
  isPending,
  cancelHref,
}: Props) {
  const {
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleFormSchema),
    defaultValues: {
      plateNo: initial?.plateNo ?? "",
      vehicleNumber: initial?.vehicleNumber ?? "",
      sthaniyaSanghId: initial?.sthaniyaSanghId ?? "",
      ownerId: initial?.ownerId ?? "",
      vehicleTypeId: initial?.vehicleTypeId ?? "",
      plateColorId: initial?.plateColorId ?? "",
      plateTypeId: initial?.plateTypeId ?? "",
      lotNo: initial?.lotNo ?? "",
      engineNumber: initial?.engineNumber ?? "",
      chassisNumber: initial?.chassisNumber ?? "",
      companyName: initial?.companyName ?? "",
      modelNo: initial?.modelNo ?? "",
    },
  });

  const ownersQuery = useQuery({
    queryKey: ["vehicle-owners", "lookup"],
    queryFn: async () => {
      const res = await api.get<{ id: string; name: string }[]>(
        "/vehicle-owners?pageSize=100"
      );
      return res.data.map((o) => ({ value: o.id, label: o.name }));
    },
    staleTime: 60_000,
  });

  const sthaniyaQuery = useLookup("sthaniya-sangh");
  const typesQuery = useLookup("vehicle-types");
  const colorsQuery = useLookup("plate-colors");
  const plateTypesQuery = useLookup("plate-types");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8" noValidate>
      <FormSection
        title="Registration"
        description="Identifying details for this vehicle."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            name="plateNo"
            control={control}
            label="Plate number"
            placeholder="BA 1 KHA 1234"
            required
          />
          <TextField
            name="vehicleNumber"
            control={control}
            label="Vehicle number"
            placeholder="VH123456"
            required
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            name="sthaniyaSanghId"
            control={control}
            label="Sthaniyasangh"
            options={sthaniyaQuery.data ?? []}
            placeholder="Select association…"
            required
            description="Local association this vehicle is registered under."
            isLoading={sthaniyaQuery.isPending}
          />
          <SelectField
            name="ownerId"
            control={control}
            label="Vehicle owner"
            options={ownersQuery.data ?? []}
            placeholder="Select owner…"
            required
            isLoading={ownersQuery.isPending}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectField
            name="vehicleTypeId"
            control={control}
            label="Vehicle type"
            options={typesQuery.data ?? []}
            placeholder="Select type…"
            required
          />
          <SelectField
            name="plateColorId"
            control={control}
            label="Plate color"
            options={colorsQuery.data ?? []}
            placeholder="Select color…"
            required
          />
          <SelectField
            name="plateTypeId"
            control={control}
            label="Plate type"
            options={plateTypesQuery.data ?? []}
            placeholder="Select type…"
            required
          />
        </div>

        <TextField
          name="lotNo"
          control={control}
          label="Lot number"
          placeholder="Optional"
        />
      </FormSection>

      <FormSection
        title="Vehicle details"
        description="Optional manufacturing and identification information."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            name="engineNumber"
            control={control}
            label="Engine number"
            placeholder="ENG123456"
          />
          <TextField
            name="chassisNumber"
            control={control}
            label="Chassis number"
            placeholder="CHS123456"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            name="companyName"
            control={control}
            label="Company"
            placeholder="Tata, Ashok Leyland, …"
          />
          <TextField
            name="modelNo"
            control={control}
            label="Model"
            placeholder="LPT 1613"
          />
        </div>
      </FormSection>

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
        <Button asChild variant="outline" type="button">
          <Link href={cancelHref}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={isPending || (mode === "edit" && !isDirty)}>
          {isPending ? "Saving…" : mode === "create" ? "Create vehicle" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}