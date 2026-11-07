"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { vehicleOwnersApi } from "../api";
import type { VehicleOwnerListParams } from "../types";

export function useVehicleOwners(params: VehicleOwnerListParams) {
  return useQuery({
    queryKey: ["vehicle-owners", params],
    queryFn: () => vehicleOwnersApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useVehicleOwner(id: string | null | undefined) {
  return useQuery({
    queryKey: ["vehicle-owners", id],
    queryFn: () => vehicleOwnersApi.get(id!),
    enabled: Boolean(id),
  });
}