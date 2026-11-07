"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FormSection } from "@/components/shared/form-section";
import {
  TextField,
  SelectField,
  ToggleField,
  FileField,
} from "@/components/shared/form-field";
import { useLookup } from "@/lib/use-lookup";
import {
  vehicleOwnerFormSchema,
  type VehicleOwnerFormValues,
} from "../schemas";
import type { VehicleOwner } from "../types";

interface VehicleOwnerFormProps {
  mode: "create" | "edit";
  initial?: VehicleOwner;
  onSubmit: (values: VehicleOwnerFormValues) => void;
  isPending: boolean;
  cancelHref: string;
}

function toDefaults(owner?: VehicleOwner): VehicleOwnerFormValues {
  return {
    name: owner?.name ?? "",
    stateId: owner?.stateId ?? "",
    districtId: owner?.districtId ?? "",
    localLevel: owner?.localLevel ?? "",
    streetAddress: owner?.streetAddress ?? "",
    email: owner?.email ?? "",
    panNumber: owner?.panNumber ?? "",
    phoneNumber: owner?.phoneNumber ?? "",
    isIndividual: owner?.isIndividual ?? false,
    contactName: owner?.contactPerson?.name ?? "",
    contactEmail: owner?.contactPerson?.email ?? "",
    contactPhone: owner?.contactPerson?.phone ?? "",
    registrationNumber: owner?.registration?.number ?? "",
  };
}

export function VehicleOwnerForm({
  mode,
  initial,
  onSubmit,
  isPending,
  cancelHref,
}: VehicleOwnerFormProps) {
  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<VehicleOwnerFormValues>({
    resolver: zodResolver(vehicleOwnerFormSchema),
    defaultValues: toDefaults(initial),
  });

  const stateId = watch("stateId");
  const isIndividual = watch("isIndividual");
  const prevState = useRef(stateId);

  useEffect(() => {
    if (prevState.current !== stateId) {
      setValue("districtId", "", { shouldDirty: true });
      prevState.current = stateId;
    }
  }, [stateId, setValue]);

  const statesQuery = useLookup("states");
  const districtsQuery = useLookup("districts", stateId || undefined, {
    enabled: Boolean(stateId),
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-8"
      noValidate
    >
      <FormSection
        title="Owner details"
        description="Core identifying information about the owner or company."
      >
        <TextField
          name="name"
          control={control}
          label="Name / company"
          placeholder="Enter name"
          required
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <SelectField
            name="stateId"
            control={control}
            label="State"
            options={statesQuery.data ?? []}
            placeholder="Select state…"
            required
            isLoading={statesQuery.isPending}
          />
          <SelectField
            name="districtId"
            control={control}
            label="District"
            options={districtsQuery.data ?? []}
            placeholder={stateId ? "Select district…" : "Select state first"}
            disabled={!stateId}
            required
            isLoading={districtsQuery.isPending}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            name="localLevel"
            control={control}
            label="Local level"
            placeholder="Municipality / Rural municipality"
          />
          <TextField
            name="streetAddress"
            control={control}
            label="Street address"
            placeholder="Ward, street, house no."
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            name="email"
            control={control}
            label="Email"
            type="email"
            placeholder="name@example.com"
          />
          <TextField
            name="panNumber"
            control={control}
            label="PAN number"
            placeholder="9 digits"
            description="Tax identifier for the business."
          />
        </div>

        <TextField
          name="phoneNumber"
          control={control}
          label="Phone number"
          type="tel"
          placeholder="01-XXXXXXX or 98XXXXXXXX"
          required
        />

        <ToggleField
          name="isIndividual"
          control={control}
          label="Is individual"
          description="When off, contact details and registration information become available."
        />
      </FormSection>

      {!isIndividual && (
        <FormSection
          title="Contact details"
          description="Who should we reach about this owner's vehicles?"
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <TextField
              name="contactName"
              control={control}
              label="Contact name"
              placeholder="Enter name"
            />
            <TextField
              name="contactPhone"
              control={control}
              label="Contact number"
              type="tel"
              placeholder="98XXXXXXXX"
            />
            <TextField
              name="contactEmail"
              control={control}
              label="Contact email"
              type="email"
              placeholder="contact@example.com"
            />
          </div>
        </FormSection>
      )}

      {!isIndividual && (
        <FormSection
          title="Registration details"
          description="Documents that verify the owner's registration."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TextField
              name="registrationNumber"
              control={control}
              label="Registration number"
              placeholder="REG-XXXXX"
            />
            <FileField
              name="registrationDocument"
              control={control}
              label="Registration document"
              description="PDF or image, up to 5 MB."
              accept=".pdf,image/*"
            />
          </div>
          <FileField
            name="logo"
            control={control}
            label="Company logo"
            description="PNG or JPEG, up to 2 MB."
            accept="image/png,image/jpeg"
          />
        </FormSection>
      )}

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
        <Button asChild variant="outline" type="button">
          <Link href={cancelHref}>Cancel</Link>
        </Button>
        <Button
          type="submit"
          disabled={isPending || (mode === "edit" && !isDirty)}
        >
          {isPending
            ? "Saving…"
            : mode === "create"
              ? "Create owner"
              : "Save changes"}
        </Button>
      </div>
    </form>
  );
}