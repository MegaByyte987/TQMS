import type { Metadata } from "next";
import { Suspense } from "react";
import { VehicleOwnersTable } from "@/features/vehicle-owners/components/vehicle-owners-table";

export const metadata: Metadata = { title: "Vehicle Owner — TQMS Pulse" };

export default function VehicleOwnersPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
      <VehicleOwnersTable />
    </Suspense>
  );
}