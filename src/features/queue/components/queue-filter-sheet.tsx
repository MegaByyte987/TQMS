"use client";

import { Filter } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

export interface QueueFilters {
  vehicleName?: string;
  cardType?: string;
  vehicleType?: string;
}

const CARD_TYPES = [
  { value: "sthaniya", label: "Sthaniya" },
  { value: "general", label: "General" },
];

const VEHICLE_TYPES = [
  { value: "truck", label: "Truck" },
  { value: "tipper", label: "Tipper" },
  { value: "container", label: "Container" },
  { value: "tanker", label: "Tanker" },
];

interface QueueFilterSheetProps {
  value: QueueFilters;
  onChange: (next: QueueFilters) => void;
  activeCount: number;
}

export function QueueFilterSheet({
  value,
  onChange,
  activeCount,
}: QueueFilterSheetProps) {
  const [draft, setDraft] = useState<QueueFilters>(value);

  return (
    <Drawer
      onOpenChange={(open) => {
        if (open) setDraft(value);
      }}
    >
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Filter className="size-3.5" aria-hidden="true" />
          Filter
          {activeCount > 0 && (
            <span className="ml-0.5 flex h-4 min-w-4 items-center justify-center rounded-[980px] bg-[var(--color-fg)] px-1 text-[10px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </Button>
      </DrawerTrigger>
      <DrawerContent side="right" className="max-w-sm">
        <DrawerHeader>
          <DrawerTitle>Filter queue</DrawerTitle>
          <DrawerDescription>
            Narrow down the existing queue by vehicle or card details.
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 px-6">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="filter-vehicle-name">Vehicle name</Label>
            <Input
              id="filter-vehicle-name"
              value={draft.vehicleName ?? ""}
              onChange={(e) =>
                setDraft((d) => ({
                  ...d,
                  vehicleName: e.target.value || undefined,
                }))
              }
              placeholder="e.g. BA 1 KHA 1234"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Card type</Label>
            <Select
              value={draft.cardType ?? "any"}
              onValueChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  cardType: v === "any" ? undefined : v,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {CARD_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label>Vehicle type</Label>
            <Select
              value={draft.vehicleType ?? "any"}
              onValueChange={(v) =>
                setDraft((d) => ({
                  ...d,
                  vehicleType: v === "any" ? undefined : v,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any</SelectItem>
                {VEHICLE_TYPES.map((t) => (
                  <SelectItem key={t.value} value={t.value}>
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button
              variant="outline"
              onClick={() => {
                setDraft({});
                onChange({});
              }}
            >
              Clear all
            </Button>
          </DrawerClose>
          <DrawerClose asChild>
            <Button onClick={() => onChange(draft)}>Apply</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}