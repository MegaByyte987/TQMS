"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { NAV_TREE } from "@/lib/routes";
import { cn } from "@/lib/cn";
import { SidebarItem } from "./sidebar-item";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapsed: () => void;
  onNavigate?: () => void;
  showToggle?: boolean;
  className?: string;
}

export function Sidebar({
  collapsed,
  onToggleCollapsed,
  onNavigate,
  showToggle = true,
  className,
}: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      data-slot="sidebar"
      className={cn(
        "flex h-full flex-col border-r border-slate-200 bg-white transition-[width] duration-200",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex h-14 items-center justify-between border-b border-slate-200 px-3">
        {!collapsed ? (
          <Link
            href="/queue"
            onClick={onNavigate}
            className="flex items-baseline gap-1.5"
          >
            <span className="text-sm font-semibold tracking-tight text-slate-900">
              TQMS
            </span>
            <span className="text-xs font-medium text-slate-400">Pulse</span>
          </Link>
        ) : (
          <span className="sr-only">TQMS Pulse</span>
        )}

        {showToggle && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="rounded-md p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
          >
            {collapsed ? (
              <PanelLeftOpen className="size-4" />
            ) : (
              <PanelLeftClose className="size-4" />
            )}
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto p-2" aria-label="Main navigation">
        <ul className="flex flex-col gap-0.5">
          {NAV_TREE.map((item) => (
            <SidebarItem
              key={item.href}
              item={item}
              collapsed={collapsed}
              pathname={pathname}
              onNavigate={onNavigate}
              onRequestExpand={onToggleCollapsed}
            />
          ))}
        </ul>
      </nav>
    </aside>
  );
}