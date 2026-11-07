"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { othersVehiclesApi } from "../api";
import { useToast } from "@/providers/toast-provider";
import { ApiError } from "@/lib/fetcher";
import type { OtherVehicleFormValues } from "../schemas";

export function useCreateOtherVehicle() {
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (body: OtherVehicleFormValues) =>
      othersVehiclesApi.create(body),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["others-vehicles"] });
      toast("success", "Entry created.");
      router.push(`/vehicle/others/${res.data.id}`);
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? Object.values(err.fieldErrors()).flat()[0] ?? err.message
          : "Could not create entry.";
      toast("error", msg);
    },
  });
}

export function useUpdateOtherVehicle() {
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: OtherVehicleFormValues;
    }) => othersVehiclesApi.update(id, body),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["others-vehicles"] });
      toast("success", "Entry updated.");
      router.push(`/vehicle/others/${vars.id}`);
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? Object.values(err.fieldErrors()).flat()[0] ?? err.message
          : "Could not update entry.";
      toast("error", msg);
    },
  });
}