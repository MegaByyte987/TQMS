"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { vehicleOwnersApi } from "../api";
import { useToast } from "@/providers/toast-provider";
import { ApiError } from "@/lib/fetcher";
import type { VehicleOwnerFormValues } from "../schemas";

export function useCreateVehicleOwner() {
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (body: VehicleOwnerFormValues) =>
      vehicleOwnersApi.create(body),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["vehicle-owners"] });
      toast("success", "Owner created.");
      router.push(`/vehicle/owners/${res.data.id}`);
    },
    onError: (err) => {
      const message =
        err instanceof ApiError
          ? Object.values(err.fieldErrors()).flat()[0] ?? err.message
          : "Could not create owner.";
      toast("error", message);
    },
  });
}

export function useUpdateVehicleOwner() {
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({
      id,
      body,
    }: {
      id: string;
      body: VehicleOwnerFormValues;
    }) => vehicleOwnersApi.update(id, body),
    onSuccess: (_res, vars) => {
      qc.invalidateQueries({ queryKey: ["vehicle-owners"] });
      toast("success", "Owner updated.");
      router.push(`/vehicle/owners/${vars.id}`);
    },
    onError: (err) => {
      const message =
        err instanceof ApiError
          ? Object.values(err.fieldErrors()).flat()[0] ?? err.message
          : "Could not update owner.";
      toast("error", message);
    },
  });
}