"use client";

import { useMutation } from "@tanstack/react-query";
import { profileApi, type ChangePasswordRequest } from "../api";
import { useToast } from "@/providers/toast-provider";
import { ApiError } from "@/lib/fetcher";
import { useRouter } from "next/navigation";

export function useChangePassword() {
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (body: ChangePasswordRequest) => profileApi.changePassword(body),
    onSuccess: () => {
      toast("success", "Password changed.");
      router.push("/profile");
    },
    onError: (err) => {
      const msg =
        err instanceof ApiError
          ? Object.values(err.fieldErrors()).flat()[0] ?? err.message
          : "Could not change password.";
      toast("error", msg);
    },
  });
}