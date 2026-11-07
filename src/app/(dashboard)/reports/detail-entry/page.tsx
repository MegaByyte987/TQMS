import type { Metadata } from "next";
import { Suspense } from "react";
import { DetailEntryReport } from "@/features/reports/components/detail-entry-report";

export const metadata: Metadata = { title: "Detail Entry Report — TQMS Pulse" };

export default function DetailEntryReportPage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">Loading…</div>}>
      <DetailEntryReport />
    </Suspense>
  );
}