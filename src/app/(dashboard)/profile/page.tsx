import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { ProfileCard } from "@/features/profile/components/profile-card";

export const metadata: Metadata = { title: "My Profile — TQMS Pulse" };

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  return <ProfileCard user={session} />;
}