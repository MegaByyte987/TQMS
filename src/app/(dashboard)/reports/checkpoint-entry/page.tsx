import type { Metadata } from "next";
import { Suspense } from "react";
import { CheckpointEntryReport } from "@/features/reports/components/checkpoint-entry-report";

export const metadata: Metadata = { title: "Checkpoint Entry — TQMS Pulse" };

export default function CheckpointEntryPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
      <CheckpointEntryReport />
    </Suspense>
  );
}