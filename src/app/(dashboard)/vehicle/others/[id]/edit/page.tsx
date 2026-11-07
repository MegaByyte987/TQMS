import type { Metadata } from "next";
import { EditOtherVehiclePage } from "@/features/others-vehicles/components/edit-other-vehicle-page";

export const metadata: Metadata = { title: "Edit other vehicle — TQMS Pulse" };

export default async function EditOtherVehicleRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditOtherVehiclePage vehicleId={id} />;
}