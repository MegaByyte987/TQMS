"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { checkUsersApi } from "../api";
import { useToast } from "@/providers/toast-provider";
import { ApiError } from "@/lib/fetcher";
import type { CheckUserFormValues } from "../schemas";

type Toast = (kind: "success" | "error" | "info", message: string) => void;

function reportError(err: unknown, toast: Toast) {
  if (err instanceof ApiError) {
    const firstFieldError = Object.values(err.fieldErrors()).flat()[0];
    toast("error", firstFieldError ?? err.message);
    return;
  }
  toast("error", "Something went wrong. Please try again.");
}

export function useCreateCheckUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (body: CheckUserFormValues) => checkUsersApi.create(body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["check-users"] });
      toast("success", "User created.");
    },
    onError: (err) => reportError(err, toast),
  });
}

export function useUpdateCheckUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: CheckUserFormValues }) =>
      checkUsersApi.update(id, body),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["check-users"] });
      toast("success", "User updated.");
    },
    onError: (err) => reportError(err, toast),
  });
}

export function useDeleteCheckUser() {
  const qc = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (id: string) => checkUsersApi.remove(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["check-users"] });
      toast("success", "User deleted.");
    },
    onError: (err) => reportError(err, toast),
  });
}