"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { othersVehiclesApi } from "../api";
import type { OtherVehicleListParams } from "../types";

export function useOthersVehicles(params: OtherVehicleListParams) {
  return useQuery({
    queryKey: ["others-vehicles", params],
    queryFn: () => othersVehiclesApi.list(params),
    placeholderData: keepPreviousData,
  });
}

export function useOtherVehicle(id: string | null | undefined) {
  return useQuery({
    queryKey: ["others-vehicles", id],
    queryFn: () => othersVehiclesApi.get(id!),
    enabled: Boolean(id),
  });
}