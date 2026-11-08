"use client";

import { useCallback, useEffect, useState } from "react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import type { AuthUser } from "@/lib/auth";

const STORAGE_KEY = "tqms-sidebar-collapsed";

interface DashboardShellProps {
  user: AuthUser;
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") {
        setCollapsed(true);
      }
    } catch {}
  }, []);

  const toggleCollapsed = useCallback(() => {
    setCollapsed((previous) => {
      const next = !previous;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {}
      return next;
    });
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <div className="sticky top-0 hidden h-screen lg:flex lg:shrink-0">
        <Sidebar collapsed={collapsed} onToggleCollapsed={toggleCollapsed} />
      </div>

      <Drawer open={mobileOpen} onOpenChange={setMobileOpen}>
        <DrawerContent side="left" className="max-w-64 gap-0 border-r-0 p-0">
          <Sidebar
            collapsed={false}
            showToggle={false}
            onToggleCollapsed={() => setMobileOpen(false)}
            onNavigate={() => setMobileOpen(false)}
          />
        </DrawerContent>
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar user={user} onOpenMobileSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}