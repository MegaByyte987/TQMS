import type { Metadata } from "next";
import { EditVehicleOwnerPage } from "@/features/vehicle-owners/components/edit-owner-page";

export const metadata: Metadata = { title: "Edit owner — TQMS Pulse" };

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditVehicleOwnerPage ownerId={id} />;
}