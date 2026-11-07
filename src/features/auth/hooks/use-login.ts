"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/features/auth/api";
import { useToast } from "@/providers/toast-provider";
import type { LoginRequest } from "@/features/auth/types";

export function useLogin(redirectTo: string) {
  const router = useRouter();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (body: LoginRequest) => authApi.login(body),
    onSuccess: (envelope) => {
      toast("success", `Welcome, ${envelope.data.name}.`);
      router.push(redirectTo);
      router.refresh();
    },
  });
}