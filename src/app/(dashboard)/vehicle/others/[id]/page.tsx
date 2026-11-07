import type { Metadata } from "next";
import { OtherVehicleDetails } from "@/features/others-vehicles/components/others-vehicle-details";

export const metadata: Metadata = { title: "Other vehicle — TQMS Pulse" };

export default async function OtherVehicleDetailsRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <OtherVehicleDetails vehicleId={id} />;
}