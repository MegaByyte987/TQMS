import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { ChangePasswordForm } from "@/features/profile/components/change-password-form";

export const metadata: Metadata = { title: "Change password — TQMS Pulse" };

export default function ChangePasswordPage() {
  return (
    <div>
      <PageHeader
        title="Change password"
        description="Update the password for your account."
      />
      <ChangePasswordForm />
    </div>
  );
}