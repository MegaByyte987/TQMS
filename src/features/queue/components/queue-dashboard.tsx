"use client";

import { useCallback, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { PageHeader } from "@/components/layout/page-header";
import { SearchInput } from "@/components/shared/search-input";
import { PendingQueueGrid } from "./pending-queue-grid";
import { ExistingQueueGrid } from "./pending-queue-grid";
import { QueueTabs } from "./queue-tabs";
import { QueueFilterSheet } from "./queue-filter-sheet";
import { CheckInPanel } from "./check-in-panel";
import { EndJourneyDialog } from "./end-journey-dialog";
import { JourneyTable } from "./journey-table";
import { usePendingQueue } from "../hooks/use-pending-queue";
import { useExistingQueue } from "../hooks/use-existing-queue";
import type { QueueCardDto } from "../types";
import {
  EXISTING_QUEUE_TABS,
  type ExistingQueueTab,
} from "@/lib/constants";

const PAGE_SIZE = 12;

function clampPage(v: number): number {
  return Number.isFinite(v) && v >= 1 ? Math.floor(v) : 1;
}

function toTab(raw: string | null): ExistingQueueTab {
  const found = EXISTING_QUEUE_TABS.find((t) => t.value === raw);
  return found ? found.value : "all";
}

export function QueueDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pendingVehicle = searchParams.get("pendingVehicle") ?? "";
  const pendingPage = clampPage(
    Number(searchParams.get("pendingPage") ?? "1")
  );

  const tab = toTab(searchParams.get("status"));
  const existingPage = clampPage(
    Number(searchParams.get("existingPage") ?? "1")
  );
  const vehicleName = searchParams.get("vehicleName") ?? "";
  const cardType = searchParams.get("cardType") ?? "";
  const vehicleType = searchParams.get("vehicleType") ?? "";

  const [checkInId, setCheckInId] = useState<string | null>(null);
  const [endJourneyCard, setEndJourneyCard] = useState<QueueCardDto | null>(null);
  const [viewCard, setViewCard] = useState<QueueCardDto | null>(null);

  const setUrlParams = useCallback(
    (updates: Record<string, string | number | undefined>) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, value] of Object.entries(updates)) {
        if (value === undefined || value === "") next.delete(key);
        else next.set(key, String(value));
      }
      const qs = next.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const pendingQuery = usePendingQueue({
    status: "pending",
    vehicleName: pendingVehicle || undefined,
    page: pendingPage,
    pageSize: PAGE_SIZE,
  });

  const existingQuery = useExistingQueue({
    status: tab === "all" ? "all" : (tab as any),
    vehicleName: vehicleName || undefined,
    cardType: cardType || undefined,
    vehicleType: vehicleType || undefined,
    page: existingPage,
    pageSize: PAGE_SIZE,
  });

  const activeFilterCount = useMemo(
    () => [vehicleName, cardType, vehicleType].filter(Boolean).length,
    [vehicleName, cardType, vehicleType]
  );

  const pendingMeta = pendingQuery.data?.meta ?? {
    page: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };
  const existingMeta = existingQuery.data?.meta ?? {
    page: 1,
    pageSize: PAGE_SIZE,
    total: 0,
    totalPages: 1,
  };

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Queue"
        description="Pending receipts and active journeys."
        actions={
          <Button asChild>
            <Link href="/queue/new">
              <Plus className="size-4" aria-hidden="true" />
              Add new queue
            </Link>
          </Button>
        }
      />

      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Pending queue
            </h2>
            <p className="text-xs text-slate-500">
              Receipts awaiting check in. Refreshes every 15 seconds.
            </p>
          </div>
          <SearchInput
            value={pendingVehicle}
            onChange={(v) =>
              setUrlParams({
                pendingVehicle: v || undefined,
                pendingPage: 1,
              })
            }
            placeholder="Search vehicle…"
            className="sm:max-w-xs"
          />
        </div>
        <PendingQueueGrid
          cards={pendingQuery.data?.data ?? []}
          total={pendingMeta.total}
          page={pendingMeta.page}
          pageSize={pendingMeta.pageSize}
          totalPages={pendingMeta.totalPages}
          isLoading={pendingQuery.isPending}
          isError={pendingQuery.isError}
          error={pendingQuery.error}
          onRetry={() => pendingQuery.refetch()}
          onPageChange={(p) => setUrlParams({ pendingPage: p })}
          onPageSizeChange={() => {}}
          onCheckIn={(card) => setCheckInId(card.id)}
          onView={(card) => setViewCard(card)}
          emptyTitle={
            pendingVehicle
              ? "No pending receipts match"
              : "No pending receipts"
          }
          emptyDescription={
            pendingVehicle
              ? "Try a different vehicle number."
              : "New receipts appear here as soon as they are issued."
          }
        />
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Existing queue
            </h2>
            <p className="text-xs text-slate-500">
              Checked-in and in-progress journeys.
            </p>
          </div>
          <QueueFilterSheet
            value={{ vehicleName, cardType, vehicleType }}
            onChange={(next) =>
              setUrlParams({
                vehicleName: next.vehicleName,
                cardType: next.cardType,
                vehicleType: next.vehicleType,
                existingPage: 1,
              })
            }
            activeCount={activeFilterCount}
          />
        </div>

        <QueueTabs
          value={tab}
          onChange={(t) => setUrlParams({ status: t, existingPage: 1 })}
        />

        <ExistingQueueGrid
          cards={existingQuery.data?.data ?? []}
          total={existingMeta.total}
          page={existingMeta.page}
          pageSize={existingMeta.pageSize}
          totalPages={existingMeta.totalPages}
          isLoading={existingQuery.isPending}
          isError={existingQuery.isError}
          error={existingQuery.error}
          onRetry={() => existingQuery.refetch()}
          onPageChange={(p) => setUrlParams({ existingPage: p })}
          onPageSizeChange={() => {}}
          onEndJourney={(card) => setEndJourneyCard(card)}
          onView={(card) => setViewCard(card)}
          emptyTitle={
            activeFilterCount > 0
              ? "No entries match your filters"
              : `No entries in ${tab === "all" ? "the existing queue" : tab.replace("_", " ")}`
          }
          emptyDescription={
            activeFilterCount > 0
              ? "Try clearing filters to see more results."
              : "Checked-in vehicles appear here."
          }
        />
      </section>

      <CheckInPanel
        queueId={checkInId}
        onClose={() => setCheckInId(null)}
      />

      <EndJourneyDialog
        card={endJourneyCard}
        onClose={() => setEndJourneyCard(null)}
      />

      <Drawer
        open={Boolean(viewCard)}
        onOpenChange={(open) => !open && setViewCard(null)}
      >
        <DrawerContent side="right" className="max-w-4xl">
          <DrawerHeader>
            <DrawerTitle>
              Journey details — {viewCard?.vehicleNo}
            </DrawerTitle>
            <DrawerDescription>
              Weights and bill numbers recorded at each checkpoint.
            </DrawerDescription>
          </DrawerHeader>
          {viewCard && <JourneyTable queueId={viewCard.id} />}
        </DrawerContent>
      </Drawer>
    </div>
  );
}