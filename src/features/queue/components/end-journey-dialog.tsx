"use client";

import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useEndJourney } from "@/features/queue/hooks/use-queue-mutations";
import type { QueueCardDto } from "@/features/queue/types";
import { formatWeight } from "@/lib/formatters";

interface EndJourneyDialogProps {
  card: QueueCardDto | null;
  onClose: () => void;
}

export function EndJourneyDialog({ card, onClose }: EndJourneyDialogProps) {
  const endJourney = useEndJourney();

  const onConfirm = () => {
    if (!card) return;
    endJourney.mutate(card.id, { onSuccess: () => onClose() });
  };

  return (
    <ConfirmDialog
      open={Boolean(card)}
      onOpenChange={(open) => !open && onClose()}
      title="End this journey?"
      description={
        card && (
          <div className="flex flex-col gap-3 text-sm">
            <p className="text-[var(--color-mut)]">
              Ending the journey moves the entry to <strong className="text-[var(--color-fg)]">Payment Pending</strong>.
              The operator cannot reverse this from the queue screen.
            </p>
            <dl className="grid grid-cols-[6rem_1fr] gap-x-2 gap-y-1.5 rounded-[8px] border border-[var(--color-bd)] bg-[var(--color-ac)] p-3 text-xs">
              <dt className="text-[var(--color-mut)]">Vehicle</dt>
              <dd className="font-medium text-[var(--color-fg)]">{card.vehicleNo}</dd>
              <dt className="text-[var(--color-mut)]">Queue</dt>
              <dd className="font-mono text-[var(--color-fg)]">
                {card.queueNumber ?? "—"}
              </dd>
              <dt className="text-[var(--color-mut)]">Route</dt>
              <dd className="text-[var(--color-fg)]">{card.routeLabel}</dd>
              <dt className="text-[var(--color-mut)]">Weight</dt>
              <dd className="tabular-nums text-[var(--color-fg)]">
                {formatWeight(card.weightKg)}
              </dd>
            </dl>
          </div>
        )
      }
      confirmLabel="End journey"
      variant="destructive"
      isPending={endJourney.isPending}
      onConfirm={onConfirm}
    />
  );
}