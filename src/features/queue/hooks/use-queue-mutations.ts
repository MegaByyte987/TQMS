"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { queueApi } from "../api";
import { useToast } from "@/providers/toast-provider";
import { ApiError } from "@/lib/fetcher";

export function useCheckIn() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => queueApi.checkIn(id),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["queue"] });
      toast("success", `Checked in — queue ${res.data.queueNumber}.`);
    },
    onError: (err) => {
      toast(
        "error",
        err instanceof ApiError
          ? err.message
          : "Could not check in. Try again."
      );
    },
  });
}

export function useEndJourney() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => queueApi.endJourney(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["queue"] });
      toast("success", "Journey ended. Payment is now pending.");
    },
    onError: (err) => {
      toast(
        "error",
        err instanceof ApiError
          ? err.message
          : "Could not end journey. Try again."
      );
    },
  });
}