import type { Metadata } from "next";
import { EditVehiclePage } from "@/features/vehicles/components/edit-vehicle-page";

export const metadata: Metadata = { title: "Edit vehicle — TQMS Pulse" };

export default async function EditVehicleRoutePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <EditVehiclePage vehicleId={id} />;
}