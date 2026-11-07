"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { vehiclesApi } from "../api";
import type { VehicleListParams } from "../types";

export function useVehicles(params: VehicleListParams) {
  return useQuery({
    queryKey: ["vehicles", params],
    queryFn: () => vehiclesApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useVehicle(id: string | null | undefined) {
  return useQuery({
    queryKey: ["vehicles", id],
    queryFn: () => vehiclesApi.get(id!),
    enabled: Boolean(id),
  });
}