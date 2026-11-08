"use client";

import { cn } from "@/lib/cn";
import { displayBS } from "@/lib/bs-date";
import type { ReceiptDraft } from "../types";

interface ReceiptPreviewProps {
  draft: ReceiptDraft;
  className?: string;
  issued?: boolean;
}

export function ReceiptPreview({
  draft,
  className,
  issued = false,
}: ReceiptPreviewProps) {
  return (
    <div
      className={cn(
        "print-receipt mx-auto w-full max-w-xs rounded-[8px] border border-[var(--color-bd)] bg-[var(--color-card)] p-4 font-mono text-[11px] leading-relaxed text-[var(--color-fg)]",
        className
      )}
    >
      <header className="border-b border-dashed border-[var(--color-bd)] pb-2 text-center">
        <p className="text-[11px] font-semibold leading-tight">
          नेपाल ट्रक यातायात व्यवसायी महासंघ
        </p>
        <p className="mt-0.5 text-[9px] text-[var(--color-mut)]">
          पान नं: 852100017
        </p>
        <p className="text-[9px] text-[var(--color-mut)]">
          फोन नं: 01-9863333, 013-5555555
        </p>
      </header>
      <div className="py-2 text-[10px]">
        <p>
          <span className="text-[var(--color-mut)]">Loadboard sthaniya</span>
        </p>
        <p>
          <span className="text-[var(--color-mut)]">रसिद नं:</span>{" "}
          <span className="font-semibold">{draft.receiptNo ?? "—"}</span>
        </p>
        <p>
          <span className="text-[var(--color-mut)]">मिति:</span>{" "}
          {draft.dateBS ? displayBS(draft.dateBS) : "—"}
        </p>
        <p>
          <span className="text-[var(--color-mut)]">समय:</span> {draft.time || "—"}
        </p>
      </div>
      <div className="border-t border-dashed border-[var(--color-bd)] py-2 text-[10px]">
        <Row label="तौलस्थान">{draft.weighStation || "—"}</Row>
        <Row label="सवारी नं">{draft.vehicleNo || "—"}</Row>
        <Row label="समान">{draft.goods || "—"}</Row>
        <Row label="विवरण">{draft.description || "—"}</Row>
        <Row label="तौल">
          {draft.weightKg > 0 ? `${draft.weightKg.toLocaleString()} kg` : "—"}
        </Row>
      </div>
      <table className="w-full border-t border-dashed border-[var(--color-bd)] text-[10px]">
        <thead>
          <tr>
            <th className="py-1 text-left font-medium text-[var(--color-mut)]">विवरण</th>
            <th className="py-1 text-right font-medium text-[var(--color-mut)]">
              रकम (रु.)
            </th>
          </tr>
        </thead>
        <tbody>
          {draft.feeLines.map((line, i) => (
            <tr key={i}>
              <td className="py-0.5">{line.label}</td>
              <td className="py-0.5 text-right tabular-nums">
                {line.amount.toFixed(2)}
              </td>
            </tr>
          ))}
          <tr className="border-t border-[var(--color-bd)]">
            <td className="pt-1 font-semibold">जम्मा शुल्क</td>
            <td className="pt-1 text-right font-semibold tabular-nums">
              {draft.feeLines.reduce((sum, l) => sum + l.amount, 0).toFixed(2)}
            </td>
          </tr>
        </tbody>
      </table>
      {!issued && (
        <p className="mt-2 text-center text-[9px] text-[var(--color-mut)] no-print">
          Draft preview — receipt number is generated on issue.
        </p>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <p className="flex gap-1">
      <span className="shrink-0 text-[var(--color-mut)]">{label}:</span>
      <span className="min-w-0 break-words">{children}</span>
    </p>
  );
}