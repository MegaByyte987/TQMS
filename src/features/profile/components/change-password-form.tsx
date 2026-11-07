"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TextField } from "@/components/shared/form-field";
import { useChangePassword } from "../hooks/use-change-password";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "../schemas";

export function ChangePasswordForm() {
  const { control, handleSubmit } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const change = useChangePassword();

  return (
    <form
      onSubmit={handleSubmit((v) => change.mutate({
        currentPassword: v.currentPassword,
        newPassword: v.newPassword,
      }))}
      className="flex max-w-md flex-col gap-4"
      noValidate
    >
      <TextField
        name="currentPassword"
        control={control}
        label="Current password"
        type="password"
        required
      />
      <TextField
        name="newPassword"
        control={control}
        label="New password"
        type="password"
        description="At least 8 characters."
        required
      />
      <TextField
        name="confirmPassword"
        control={control}
        label="Confirm new password"
        type="password"
        required
      />

      <div className="flex flex-col-reverse gap-2 border-t border-slate-200 pt-4 sm:flex-row sm:justify-end">
        <Button asChild variant="outline" type="button">
          <Link href="/profile">Cancel</Link>
        </Button>
        <Button type="submit" disabled={change.isPending}>
          {change.isPending ? "Changing…" : "Change password"}
        </Button>
      </div>
    </form>
  );
}