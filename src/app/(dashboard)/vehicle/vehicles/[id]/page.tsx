import type { Metadata } from "next";
import { VehicleDetails } from "@/features/vehicles/components/vehicle-details";

export const metadata: Metadata = { title: "Vehicle — TQMS Pulse" };

export default async function VehicleDetailsRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VehicleDetails vehicleId={id} />;
}