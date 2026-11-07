import type { Metadata } from "next";
import { Suspense } from "react";
import { QueueDashboard } from "@/features/queue/components/queue-dashboard";

export const metadata: Metadata = { title: "Queue — TQMS Pulse" };

export default function QueuePage() {
  return (
    <Suspense fallback={<div className="text-sm text-slate-500">Loading queue…</div>}>
      <QueueDashboard />
    </Suspense>
  );
}