"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addQueueApi } from "../api";
import { useToast } from "@/providers/toast-provider";
import { ApiError } from "@/lib/fetcher";
import type { AddQueueFormValues } from "../schemas";

export function useCreateQueue(onIssued: (data: Awaited<ReturnType<typeof addQueueApi.create>>["data"]) => void) {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (values: AddQueueFormValues) => addQueueApi.create(values),
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["queue"] });
      toast("success", `Receipt ${res.data.receipt.receiptNo} issued.`);
      onIssued(res.data);
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        const firstField = Object.values(err.fieldErrors()).flat()[0];
        toast("error", firstField ?? err.message);
      } else {
        toast("error", "Could not issue receipt. Try again.");
      }
    },
  });
}