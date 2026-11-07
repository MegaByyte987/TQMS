"use client";

import { CalendarDays, MapPin, Phone, Truck, User, Weight } from "lucide-react";
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
        "flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 transition-shadow hover:shadow-sm",
        className
      )}
    >
      <header className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-semibold tracking-tight text-slate-900">
            {card.vehicleNo}
          </span>
          <span className="text-xs text-slate-500">{card.vehicleType}</span>
        </div>
        <StatusBadge
          label={QUEUE_STATUS_LABEL[card.status]}
          variant={QUEUE_STATUS_VARIANT[card.status]}
        />
      </header>

      {card.queueNumber && (
        <div className="flex items-center gap-1.5 text-xs text-slate-600">
          <span className="font-medium uppercase tracking-wide text-slate-500">
            Queue
          </span>
          <span className="font-mono text-slate-900">{card.queueNumber}</span>
        </div>
      )}

      <dl className="grid grid-cols-1 gap-1.5 text-xs">
        <Row icon={MapPin} label="Route">
          <span className="truncate">{card.routeLabel}</span>
        </Row>
        <Row icon={CalendarDays} label="Entry">
          <span>{displayBS(card.entryDateBS)}</span>
        </Row>
        <Row icon={Weight} label="Weight">
          <span className="tabular-nums">{formatWeight(card.weightKg)}</span>
        </Row>
        <Row icon={Truck} label="Load">
          <span className="truncate">{orDash(card.loadDetails)}</span>
        </Row>
        {card.transportCompany && (
          <Row icon={Truck} label="Carrier">
            <span className="truncate">{card.transportCompany}</span>
          </Row>
        )}
        {card.ownerName && (
          <Row icon={User} label="Owner">
            <span className="truncate">{card.ownerName}</span>
          </Row>
        )}
      </dl>

      <div className="mt-auto flex flex-wrap gap-1.5 border-t border-slate-100 pt-3">
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
    <div className="flex items-center gap-2">
      <Icon className="size-3 shrink-0 text-slate-400" aria-hidden="true" />
      <dt className="w-14 shrink-0 text-slate-500">{label}</dt>
      <dd className="min-w-0 flex-1 text-slate-900">{children}</dd>
    </div>
  );
}