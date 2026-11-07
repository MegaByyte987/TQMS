"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SelectField } from "@/components/shared/form-field";
import { useLookup } from "@/lib/use-lookup";
import {
  otherVehicleFormSchema,
  type OtherVehicleFormValues,
} from "../schemas";
import type { OtherVehicle } from "../types";

interface Props {
  mode: "create" | "edit";
  initial?: OtherVehicle;
  onSubmit: (values: OtherVehicleFormValues) => void;
  isPending: boolean;
  cancelHref: string;
}

export function OtherVehicleForm({
  mode,
  initial,
  onSubmit,
  isPending,
  cancelHref,
}: Props) {
  const { control, handleSubmit, formState: { isDirty } } = useForm<OtherVehicleFormValues>({
    resolver: zodResolver(otherVehicleFormSchema),
    defaultValues: { othersTypeId: initial?.othersTypeId ?? "" },
  });

  const othersTypesQuery = useLookup("others-types");

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      <SelectField
        name="othersTypeId"
        control={control}
        label="Others type"
        options={othersTypesQuery.data ?? []}
        placeholder="Select type…"
        required
        description="The system assigns a formatted number and number type based on this selection."
        isLoading={othersTypesQuery.isPending}
      />

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
        <Button asChild variant="outline" type="button">
          <Link href={cancelHref}>Cancel</Link>
        </Button>
        <Button type="submit" disabled={isPending || (mode === "edit" && !isDirty)}>
          {isPending ? "Saving…" : mode === "create" ? "Create entry" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}