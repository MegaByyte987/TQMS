import type { Metadata } from "next";
import { AddQueuePage } from "@/features/add-queue/components/add-queue-page";

export const metadata: Metadata = { title: "Add new queue — TQMS Pulse" };

export default function AddQueueRoutePage() {
  return <AddQueuePage />;
}