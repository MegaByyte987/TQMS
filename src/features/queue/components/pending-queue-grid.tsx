"use client";

import { CardGridSkeleton } from "./card-grid-skeleton";
import { QueueCard } from "./queue-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ErrorState } from "@/components/shared/error-state";
import { Pagination } from "@/components/shared/data-table/pagination";
import type { QueueCardDto } from "@/features/queue/types";

interface GridProps {
  cards: QueueCardDto[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  isLoading: boolean;
  isError: boolean;
  error?: unknown;
  onRetry: () => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  onView: (card: QueueCardDto) => void;
  onCheckIn?: (card: QueueCardDto) => void;
  onEndJourney?: (card: QueueCardDto) => void;
  emptyTitle: string;
  emptyDescription: string;
}

function GridBase({
  cards,
  total,
  page,
  pageSize,
  totalPages,
  isLoading,
  isError,
  error,
  onRetry,
  onPageChange,
  onPageSizeChange,
  onView,
  onCheckIn,
  onEndJourney,
  emptyTitle,
  emptyDescription,
}: GridProps) {
  if (isError) {
    return <ErrorState error={error} onRetry={onRetry} />;
  }
  if (isLoading) {
    return <CardGridSkeleton />;
  }
  if (cards.length === 0) {
    return <EmptyState title={emptyTitle} description={emptyDescription} />;
  }
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {cards.map((card) => (
          <QueueCard
            key={card.id}
            card={card}
            onView={onView}
            onCheckIn={onCheckIn}
            onEndJourney={onEndJourney}
          />
        ))}
      </div>
      <div className="overflow-hidden rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)]">
        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          totalPages={totalPages}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </div>
  );
}

export function PendingQueueGrid(props: Omit<GridProps, "onEndJourney">) {
  return <GridBase {...props} />;
}

export function ExistingQueueGrid(props: Omit<GridProps, "onCheckIn">) {
  return <GridBase {...props} />;
}