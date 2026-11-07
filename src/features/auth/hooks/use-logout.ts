"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { authApi } from "@/features/auth/api";
import { useToast } from "@/providers/toast-provider";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.clear();
      toast("info", "Signed out.");
      router.push("/login");
      router.refresh();
    },
    onError: () => {
      toast("error", "Could not sign out. Try again.");
    },
  });
}