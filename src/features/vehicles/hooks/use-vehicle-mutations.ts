"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { vehiclesApi } from "../api";
import { useToast } from "@/providers/toast-provider";
import { ApiError } from "@/lib/fetcher";
import type { VehicleFormValues } from "../schemas";

export function useCreateVehicle() {
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (body: VehicleFormValues) => vehiclesApi.create(body),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast("success", "Vehicle created.");
      router.push(`/vehicle/vehicles/${res.data.id}`);
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? Object.values(err.fieldErrors()).flat()[0] ?? err.message
          : "Could not create vehicle.";
      toast("error", msg);
    },
  });
}

export function useUpdateVehicle() {
  const qc = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: VehicleFormValues }) =>
      vehiclesApi.update(id, body),
    onSuccess: (_r, v) => {
      qc.invalidateQueries({ queryKey: ["vehicles"] });
      toast("success", "Vehicle updated.");
      router.push(`/vehicle/vehicles/${v.id}`);
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? Object.values(err.fieldErrors()).flat()[0] ?? err.message
          : "Could not update vehicle.";
      toast("error", msg);
    },
  });
}