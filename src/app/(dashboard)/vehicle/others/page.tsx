import type { Metadata } from "next";
import { Suspense } from "react";
import { OthersVehiclesTable } from "@/features/others-vehicles/components/others-vehicles-table";

export const metadata: Metadata = { title: "Other's Vehicle — TQMS Pulse" };

export default function OthersVehiclesRoutePage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
      <OthersVehiclesTable />
    </Suspense>
  );
}