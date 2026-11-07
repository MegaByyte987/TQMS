"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { narrationsApi } from "../api";
import { useToast } from "@/providers/toast-provider";
import { ApiError } from "@/lib/fetcher";
import type { NarrationEditValues } from "../schemas";

export function useUpdateNarration() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: NarrationEditValues }) =>
      narrationsApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["narrations"] });
      toast("success", "Narration updated.");
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? Object.values(err.fieldErrors()).flat()[0] ?? err.message
          : "Could not update narration.";
      toast("error", msg);
    },
  });
}