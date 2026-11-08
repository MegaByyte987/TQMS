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
      <div className="flex flex-col gap-2 px-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-8 w-full rounded-[8px]" />
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
    <div className="overflow-hidden rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)]">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13.5px]">
          <thead>
            <tr className="border-b border-[var(--color-bd)] bg-[var(--color-ac)]">
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
    </div>
  );
}

function JourneyRow({ row }: { row: JourneyRowDto }) {
  const [c1, c2, c3] = row.checkpoints;
  return (
    <tr className="border-b border-[var(--color-bd)] last:border-b-0">
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

function Th({ children, align }: { children: React.ReactNode; align?: "right" }) {
  return (
    <th
      className={
        "h-[38px] whitespace-nowrap px-3 text-left text-[11px] font-medium uppercase tracking-[0.1em] text-[var(--color-mut)] " +
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
        "whitespace-nowrap px-3 py-2.5 text-[var(--color-fg)] " +
        (align === "right" ? "text-right tabular-nums " : "") +
        className
      }
    >
      {children}
    </td>
  );
}