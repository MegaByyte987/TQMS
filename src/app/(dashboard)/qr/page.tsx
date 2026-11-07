import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { QrCard } from "@/features/qr/components/qr-card";

export const metadata: Metadata = { title: "Generate QR — TQMS Pulse" };

export default function QrPage() {
  return (
    <div>
      <PageHeader
        title="Generate QR"
        description="Produce a checkpoint token as a downloadable QR code."
      />
      <div className="flex justify-center">
        <QrCard />
      </div>
    </div>
  );
}