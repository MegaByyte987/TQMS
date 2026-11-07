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
            <p>
              Ending the journey moves the entry to <strong>Payment Pending</strong>.
              The operator cannot reverse this from the queue screen.
            </p>
            <dl className="grid grid-cols-[6rem_1fr] gap-x-2 gap-y-1 rounded-md bg-slate-50 p-3 text-xs">
              <dt className="text-slate-500">Vehicle</dt>
              <dd className="font-medium text-slate-900">{card.vehicleNo}</dd>
              <dt className="text-slate-500">Queue</dt>
              <dd className="font-mono text-slate-900">
                {card.queueNumber ?? "—"}
              </dd>
              <dt className="text-slate-500">Route</dt>
              <dd className="text-slate-900">{card.routeLabel}</dd>
              <dt className="text-slate-500">Weight</dt>
              <dd className="tabular-nums text-slate-900">
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