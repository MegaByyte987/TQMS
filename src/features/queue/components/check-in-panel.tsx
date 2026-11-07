"use client";

import { useQueueDetail } from "@/features/queue/hooks/use-queue-detail";
import { useCheckIn } from "@/features/queue/hooks/use-queue-mutations";
import { DetailList } from "@/components/shared/detail-list";
import { StatusBadge } from "@/components/shared/status-badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ErrorState } from "@/components/shared/error-state";
import { QUEUE_STATUS_LABEL, QUEUE_STATUS_VARIANT } from "@/lib/constants";
import { displayBS } from "@/lib/bs-date";
import { formatPhone, formatWeight, orDash } from "@/lib/formatters";

interface CheckInPanelProps {
  queueId: string | null;
  onClose: () => void;
}

export function CheckInPanel({ queueId, onClose }: CheckInPanelProps) {
  const detailQuery = useQueueDetail(queueId);
  const checkIn = useCheckIn();

  const onConfirm = () => {
    if (!queueId) return;
    checkIn.mutate(queueId, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Drawer
      open={Boolean(queueId)}
      onOpenChange={(open) => !open && onClose()}
    >
      <DrawerContent side="right" className="max-w-md">
        <DrawerHeader>
          <DrawerTitle>Check in vehicle</DrawerTitle>
          <DrawerDescription>
            Confirm the details below before starting the journey.
          </DrawerDescription>
        </DrawerHeader>

        {detailQuery.isPending && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex justify-between gap-4">
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            ))}
          </div>
        )}

        {detailQuery.isError && (
          <ErrorState
            error={detailQuery.error}
            onRetry={() => detailQuery.refetch()}
          />
        )}

        {detailQuery.data && (
          <DetailList
            rows={[
              {
                label: "Status",
                value: (
                  <StatusBadge
                    label={QUEUE_STATUS_LABEL[detailQuery.data.status]}
                    variant={QUEUE_STATUS_VARIANT[detailQuery.data.status]}
                  />
                ),
              },
              {
                label: "Queue No.",
                value: detailQuery.data.queueNumber ?? "—",
              },
              {
                label: "Receipt",
                value: detailQuery.data.receiptNo,
              },
              {
                label: "Entry date",
                value: displayBS(detailQuery.data.entryDateBS),
              },
              {
                label: "Vehicle",
                value: detailQuery.data.vehicleNo,
              },
              {
                label: "Type",
                value: detailQuery.data.vehicleType,
              },
              {
                label: "Route",
                value: detailQuery.data.routeLabel,
              },
              {
                label: "Last checkpoint",
                value: detailQuery.data.lastCheckpoint,
              },
              {
                label: "Weight",
                value: formatWeight(detailQuery.data.weightKg),
              },
              {
                label: "Load details",
                value: orDash(detailQuery.data.loadDetails),
              },
              {
                label: "Transport",
                value: orDash(detailQuery.data.transportCompany),
              },
              {
                label: "Owner",
                value: orDash(detailQuery.data.ownerName),
              },
              {
                label: "Driver phone",
                value: detailQuery.data.driverPhone
                  ? formatPhone(detailQuery.data.driverPhone)
                  : "—",
              },
              {
                label: "Registered",
                value: detailQuery.data.isRegistered ? "Yes" : "No",
              },
              {
                label: "Card",
                value: detailQuery.data.cardRegistered ? "Registered" : "Not registered",
              },
            ]}
          />
        )}

        <DrawerFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={
              checkIn.isPending ||
              detailQuery.isPending ||
              detailQuery.isError ||
              detailQuery.data?.status !== "pending"
            }
          >
            {checkIn.isPending ? "Checking in…" : "Confirm check in"}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}