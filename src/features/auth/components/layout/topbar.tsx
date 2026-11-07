"use client";

import { Menu } from "lucide-react";
import { Breadcrumbs } from "./breadcrumbs";
import { ProfileMenu } from "./profile-menu";

interface TopbarProps {
  user: AuthUser;
  onOpenMobileSidebar: () => void;
}

export function Topbar({ user, onOpenMobileSidebar }: TopbarProps) {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white px-4">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          aria-label="Open navigation"
          className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 lg:hidden"
        >
          <Menu className="size-5" />
        </button>
        <Breadcrumbs />
      </div>
      <ProfileMenu user={user} />
    </header>
  );
}   