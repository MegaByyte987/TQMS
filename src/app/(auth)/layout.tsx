import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session) redirect("/queue");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] p-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-semibold leading-[1.04] tracking-[-0.055em] text-[var(--color-fg)]">
            TQMS Pulse
          </h1>
          <p className="mt-1 text-[14px] leading-[1.5] text-[var(--color-mut)]">
            Transport Queue Management System
          </p>
        </div>
        {/* Removed shadow-sm, added hairline border and exact 12px radius */}
        <div className="rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-8">
          {children}
        </div>
      </div>
    </div>
  );
}