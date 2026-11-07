"use client";

import { useRouter } from "next/navigation";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { ReceiptPreview } from "./receipt-preview";
import { AddQueueForm } from "./add-queue-form";
import type { CreateQueueResponse } from "../types";
import { useState } from "react";

export function AddQueuePage() {
  const router = useRouter();
  const [issued, setIssued] = useState<CreateQueueResponse | null>(null);

  if (issued) {
    return (
      <IssuedView
        data={issued}
        onBack={() => router.push("/queue")}
        onReset={() => setIssued(null)}
      />
    );
  }

  return (
    <>
      <PageHeader
        title="Add new queue"
        description="Issue a weighbridge receipt and enqueue a vehicle."
      />
      <AddQueueForm onIssued={setIssued} />
    </>
  );
}

function IssuedView({
  data,
  onBack,
  onReset,
}: {
  data: CreateQueueResponse;
  onBack: () => void;
  onReset: () => void;
}) {
  const onPrint = () => window.print();

  return (
    <>
      <PageHeader
        title="Receipt issued"
        description="Print the receipt for the driver, or return to the queue."
      />

      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-900">
          Receipt <strong>{data.receipt.receiptNo}</strong> issued for{" "}
          <strong>{data.receipt.vehicleNo}</strong>.
        </div>

        <ReceiptPreview
          draft={{
            receiptNo: data.receipt.receiptNo,
            dateBS: data.receipt.dateBS,
            time: data.receipt.time,
            weighStation: data.receipt.weighStation,
            vehicleNo: data.receipt.vehicleNo,
            goods: data.receipt.goods,
            description: data.receipt.description,
            weightKg: data.receipt.weightKg,
            feeLines: data.receipt.feeLines,
          }}
          issued
        />

        <div className="flex flex-wrap items-center justify-center gap-2 no-print">
          <Button variant="outline" onClick={onReset}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Issue another
          </Button>
          <Button variant="outline" onClick={onBack}>
            Back to queue
          </Button>
          <Button onClick={onPrint}>
            <Printer className="size-4" aria-hidden="true" />
            Print receipt
          </Button>
        </div>
      </div>
    </>
  );
}