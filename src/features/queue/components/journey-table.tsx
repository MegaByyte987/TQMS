"use client";

import { useJourney } from "@/features/queue/hooks/use-journey";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/shared/error-state";
import { EmptyState } from "@/components/shared/empty-state";
import { displayBS } from "@/lib/bs-date";
import { formatWeight, orDash } from "@/lib/formatters";
import type { CheckpointVisit, JourneyRowDto } from "@/features/queue/types";

interface JourneyTableProps {
  queueId: string | null;
}

export function JourneyTable({ queueId }: JourneyTableProps) {
  const query = useJourney(queueId);

  if (query.isPending) {
    return (
      <div className="flex flex-col gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full" />
        ))}
      </div>
    );
  }

  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => query.refetch()} />;
  }

  if (!query.data || query.data.length === 0) {
    return (
      <EmptyState
        title="No journey data"
        description="This vehicle has not been checked in yet."
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-slate-200">
      <table className="w-full border-collapse text-xs">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            <Th>S.N</Th>
            <Th>Entry date</Th>
            <Th>From</Th>
            <Th>To</Th>
            <Th align="right">CP1 wt.</Th>
            <Th align="right">CP2 wt.</Th>
            <Th align="right">CP3 wt.</Th>
            <Th>CP 1</Th>
            <Th>CP1 bill no.</Th>
            <Th>CP 2</Th>
            <Th>CP2 bill no.</Th>
            <Th>CP 3</Th>
            <Th>CP3 bill no.</Th>
          </tr>
        </thead>
        <tbody>
          {query.data.map((row) => (
            <JourneyRow key={row.id} row={row} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function JourneyRow({ row }: { row: JourneyRowDto }) {
  const [c1, c2, c3] = row.checkpoints;
  return (
    <tr className="border-b border-slate-100">
      <Td>{row.sN}</Td>
      <Td>{displayBS(row.entryDateBS)}</Td>
      <Td>{row.from}</Td>
      <Td>{row.to}</Td>
      <Td align="right">{c1 ? formatWeight(c1.weightKg) : "—"}</Td>
      <Td align="right">{c2 ? formatWeight(c2.weightKg) : "—"}</Td>
      <Td align="right">{c3 ? formatWeight(c3.weightKg) : "—"}</Td>
      <Td>{c1 ? c1.name : "—"}</Td>
      <Td className="font-mono">{c1 ? c1.billNo : "—"}</Td>
      <Td>{c2 ? c2.name : "—"}</Td>
      <Td className="font-mono">{c2 ? c2.billNo : "—"}</Td>
      <Td>{c3 ? c3.name : "—"}</Td>
      <Td className="font-mono">{c3 ? c3.billNo : "—"}</Td>
    </tr>
  );
}

function Th({
  children,
  align,
}: {
  children: React.ReactNode;
  align?: "right";
}) {
  return (
    <th
      className={
        "whitespace-nowrap px-2 py-2 text-left text-[10px] font-medium uppercase tracking-wide text-slate-500 " +
        (align === "right" ? "text-right" : "")
      }
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align,
  className = "",
}: {
  children: React.ReactNode;
  align?: "right";
  className?: string;
}) {
  return (
    <td
      className={
        "px-2 py-2 text-slate-700 " +
        (align === "right" ? "text-right tabular-nums " : "") +
        className
      }
    >
      {children}
    </td>
  );
}