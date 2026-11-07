"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EXISTING_QUEUE_TABS, type ExistingQueueTab } from "@/lib/constants";

interface QueueTabsProps {
  value: ExistingQueueTab;
  onChange: (tab: ExistingQueueTab) => void;
}

export function QueueTabs({ value, onChange }: QueueTabsProps) {
  return (
    <Tabs
      value={value}
      onValueChange={(v) => onChange(v as ExistingQueueTab)}
    >
      <TabsList className="h-8">
        {EXISTING_QUEUE_TABS.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="text-xs"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}