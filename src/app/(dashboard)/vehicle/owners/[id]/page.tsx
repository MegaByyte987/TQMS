import type { Metadata } from "next";
import { VehicleOwnerDetails } from "@/features/vehicle-owners/components/vehicle-owner-details";

export const metadata: Metadata = { title: "Owner — TQMS Pulse" };

export default async function VehicleOwnerDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VehicleOwnerDetails ownerId={id} />;
}