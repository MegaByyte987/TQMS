import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckUsersTable } from "@/features/check-users/components/check-users-table";

export const metadata: Metadata = { title: "Check User — TQMS Pulse" };

export default function CheckUsersPage() {
  return (
    <Suspense
      fallback={
        <div className="text-sm text-slate-500">Loading check users…</div>
      }
    >
      <CheckUsersTable />
    </Suspense>
  );
}