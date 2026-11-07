import type { Metadata } from "next";
import { NarrationsTable } from "@/features/narrations/components/narrations-table";

export const metadata: Metadata = { title: "Narration — TQMS Pulse" };

export default function NarrationsPage() {
  return <NarrationsTable />;
}