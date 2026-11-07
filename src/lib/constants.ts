import type { QueueStatus } from "@/features/queue/types";

export const QUEUE_STATUS_LABEL: Record<QueueStatus, string> = {
  pending: "Pending",
  in_queue: "In Queue",
  in_job: "In Job",
  unregistered: "Unregistered",
  payment_pending: "Payment Pending",
  closed: "Closed",
};

export const QUEUE_STATUS_VARIANT: Record<
  QueueStatus,
  "success" | "info" | "warning" | "muted" | "secondary"
> = {
  pending: "warning",
  in_queue: "info",
  in_job: "success",
  unregistered: "muted",
  payment_pending: "warning",
  closed: "secondary",
};

export const EXISTING_QUEUE_TABS = [
  { value: "all", label: "All" },
  { value: "in_job", label: "In Job" },
  { value: "in_queue", label: "In Queue" },
  { value: "unregistered", label: "Unregistered" },
  { value: "payment_pending", label: "Payment Pending" },
] as const;

export type ExistingQueueTab = (typeof EXISTING_QUEUE_TABS)[number]["value"];