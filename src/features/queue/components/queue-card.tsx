"use client";

import { CalendarDays, MapPin, Truck, User, Weight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/shared/status-badge";
import { QUEUE_STATUS_LABEL, QUEUE_STATUS_VARIANT } from "@/lib/constants";
import { displayBS } from "@/lib/bs-date";
import { formatWeight, orDash } from "@/lib/formatters";
import type { QueueCardDto } from "@/features/queue/types";
import { cn } from "@/lib/cn";

interface QueueCardProps {
  card: QueueCardDto;
  onCheckIn?: (card: QueueCardDto) => void;
  onView: (card: QueueCardDto) => void;
  onEndJourney?: (card: QueueCardDto) => void;
  className?: string;
}

export function QueueCard({
  card,
  onCheckIn,
  onView,
  onEndJourney,
  className,
}: QueueCardProps) {
  const canCheckIn = card.status === "pending" && onCheckIn;
  const canEndJourney = card.status === "in_job" && onEndJourney;

  return (
    <article
      className={cn(
        "flex flex-col gap-3 rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-4 transition-colors hover:bg-[var(--color-ac)] min-w-0",
        className
      )}
    >
      <header className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-sm font-semibold tracking-tight text-[var(--color-fg)] truncate" title={card.vehicleNo}>
            {card.vehicleNo}
          </span>
          <span className="text-xs text-[var(--color-mut)] truncate" title={card.vehicleType}>
            {card.vehicleType}
          </span>
        </div>
        <StatusBadge
          label={QUEUE_STATUS_LABEL[card.status]}
          variant={QUEUE_STATUS_VARIANT[card.status]}
        />
      </header>

      {card.queueNumber && (
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-mut)] min-w-0">
          <span className="font-medium uppercase tracking-[0.1em] shrink-0">
            Queue
          </span>
          <span className="font-mono text-[var(--color-fg)] truncate" title={card.queueNumber}>
            {card.queueNumber}
          </span>
        </div>
      )}

      <dl className="grid grid-cols-1 gap-1.5 text-xs">
        <Row icon={MapPin} label="Route">
          <span className="truncate block" title={card.routeLabel}>{card.routeLabel}</span>
        </Row>
        <Row icon={CalendarDays} label="Entry">
          <span className="truncate block" title={displayBS(card.entryDateBS)}>{displayBS(card.entryDateBS)}</span>
        </Row>
        <Row icon={Weight} label="Weight">
          <span className="tabular-nums truncate block" title={formatWeight(card.weightKg)}>{formatWeight(card.weightKg)}</span>
        </Row>
        <Row icon={Truck} label="Load">
          <span className="truncate block" title={orDash(card.loadDetails)}>{orDash(card.loadDetails)}</span>
        </Row>
        {card.transportCompany && (
          <Row icon={Truck} label="Carrier">
            <span className="truncate block" title={card.transportCompany}>{card.transportCompany}</span>
          </Row>
        )}
        {card.ownerName && (
          <Row icon={User} label="Owner">
            <span className="truncate block" title={card.ownerName}>{card.ownerName}</span>
          </Row>
        )}
      </dl>

      <div className="mt-auto flex flex-wrap gap-1.5 border-t border-[var(--color-bd)] pt-3">
        {canCheckIn && (
          <Button
            size="sm"
            variant="default"
            onClick={() => onCheckIn(card)}
            className="flex-1"
          >
            Check in
          </Button>
        )}
        <Button
          size="sm"
          variant="outline"
          onClick={() => onView(card)}
          className="flex-1"
        >
          View
        </Button>
        {canEndJourney && (
          <Button
            size="sm"
            variant="destructive"
            onClick={() => onEndJourney(card)}
            className="flex-1"
          >
            End
          </Button>
        )}
      </div>
    </article>
  );
}

function Row({
  icon: Icon,
  label,
  children,
}: {
  icon: typeof MapPin;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 min-w-0">
      <Icon className="size-3 shrink-0 text-[var(--color-mut)]" aria-hidden="true" />
      <dt className="w-14 shrink-0 text-[var(--color-mut)]">{label}</dt>
      <dd className="min-w-0 flex-1 text-[var(--color-fg)]">{children}</dd>
    </div>
  );
}