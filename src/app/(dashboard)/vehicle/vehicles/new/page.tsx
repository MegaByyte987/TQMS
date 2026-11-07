import type { Metadata } from "next";
import { NewVehiclePage } from "@/features/vehicles/components/new-vehicle-page";

export const metadata: Metadata = { title: "Add vehicle — TQMS Pulse" };

export default function NewVehicleRoutePage() {
  return <NewVehiclePage />;
}