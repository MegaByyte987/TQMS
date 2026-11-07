import type { Metadata } from "next";
import { NewOtherVehiclePage } from "@/features/others-vehicles/components/new-other-vehicle-page";

export const metadata: Metadata = { title: "Add other vehicle — TQMS Pulse" };

export default function NewOtherVehicleRoutePage() {
  return <NewOtherVehiclePage />;
}