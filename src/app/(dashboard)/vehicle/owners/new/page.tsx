import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { VehicleOwnerForm } from "@/features/vehicle-owners/components/vehicle-owner-form";
import { NewVehicleOwnerPage } from "@/features/vehicle-owners/components/new-owner-page";

export const metadata: Metadata = { title: "Add owner — TQMS Pulse" };

export default function NewOwnerPage() {
  return <NewVehicleOwnerPage />;
}