"use client";

import { Menu } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { ProfileMenu } from "./profile-menu";
import type { AuthUser } from "@/lib/auth";

interface TopbarProps {
  user: AuthUser;
  onOpenMobileSidebar: () => void;
}

export function Topbar({ user, onOpenMobileSidebar }: TopbarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-[var(--color-bd)] bg-[var(--color-card)]/80 px-4 backdrop-blur-[14px] lg:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation"
          className="rounded-[8px] p-1.5 text-[var(--color-mut)] hover:bg-[var(--color-ac)] hover:text-[var(--color-fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6d8bff] lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <Breadcrumbs />
      </div>
      <ProfileMenu user={user} />
    </header>
  );
}