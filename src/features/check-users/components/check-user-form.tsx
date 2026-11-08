"use client";

import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { TextField, SelectField } from "@/components/shared/form-field";
import {
  checkUserFormSchema,
  type CheckUserFormValues,
} from "@/features/check-users/schemas";
import type { CheckUser } from "@/features/check-users/types";
import { useLookup } from "@/lib/use-lookup";

interface CheckUserFormProps {
  mode: "create" | "edit";
  initial?: CheckUser;
  onSubmit: (values: CheckUserFormValues) => void;
  isPending: boolean;
}

const EMPTY: CheckUserFormValues = {
  name: "",
  stateId: "",
  districtId: "",
  streetAddress: "",
  mobileNumber: "",
  email: "",
};

export function CheckUserForm({
  mode,
  initial,
  onSubmit,
  isPending,
}: CheckUserFormProps) {
  const defaults: CheckUserFormValues = initial
    ? {
        name: initial.name,
        stateId: initial.stateId,
        districtId: initial.districtId,
        streetAddress: initial.streetAddress ?? "",
        mobileNumber: initial.mobileNumber,
        email: initial.email ?? "",
      }
    : EMPTY;

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<CheckUserFormValues>({
    resolver: zodResolver(checkUserFormSchema),
    defaultValues: defaults,
  });

  const stateId = watch("stateId");
  const prevState = useRef(stateId);

  useEffect(() => {
    if (prevState.current !== stateId) {
      setValue("districtId", "");
      prevState.current = stateId;
    }
  }, [stateId, setValue]);

  const statesQuery = useLookup("states");
  const districtsQuery = useLookup("districts", stateId || undefined, {
    enabled: Boolean(stateId),
  });

  const stateOptions = statesQuery.data ?? [];
  const districtOptions = districtsQuery.data ?? [];

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-1 flex-col gap-4"
      noValidate
    >
      <TextField
        name="name"
        control={control}
        label="Staff name"
        placeholder="Enter full name"
        required
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          name="stateId"
          control={control}
          label="State"
          options={stateOptions}
          placeholder="Select state…"
          required
          isLoading={statesQuery.isPending}
        />
        <SelectField
          name="districtId"
          control={control}
          label="District"
          options={districtOptions}
          placeholder={stateId ? "Select district…" : "Select state first"}
          disabled={!stateId}
          required
          isLoading={districtsQuery.isPending}
        />
      </div>
      <TextField
        name="streetAddress"
        control={control}
        label="Street address"
        placeholder="Ward, street, house no."
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField
          name="mobileNumber"
          control={control}
          label="Mobile number"
          placeholder="98XXXXXXXX"
          type="tel"
          required
        />
        <TextField
          name="email"
          control={control}
          label="Email"
          placeholder="name@example.com"
          type="email"
        />
      </div>
      <div className="mt-auto flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
        <Button type="submit" disabled={isPending || (mode === "edit" && !isDirty)}>
          {isPending
            ? "Saving…"
            : mode === "edit"
            ? "Save changes"
            : "Create user"}
        </Button>
      </div>
    </form>
  );
}