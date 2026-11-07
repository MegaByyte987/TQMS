import type { Metadata } from "next";
import { Suspense } from "react";
import { VehiclesTable } from "@/features/vehicles/components/vehicles-table";

export const metadata: Metadata = { title: "Vehicles — TQMS Pulse" };

export default function VehiclesRoutePage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
      <VehiclesTable />
    </Suspense>
  );
}