"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";
import type { NavItem } from "@/lib/routes";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/cn";

interface SidebarItemProps {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  onNavigate?: () => void;
  onRequestExpand?: () => void;
}

export function SidebarItem({
  item,
  collapsed,
  pathname,
  onNavigate,
  onRequestExpand,
}: SidebarItemProps) {
  const hasChildren = Boolean(item.children?.length);
  const isActive =
    pathname === item.href || pathname.startsWith(item.href + "/");
  const hasActiveChild = item.children?.some(
    (child) =>
      pathname === child.href || pathname.startsWith(child.href + "/")
  );

  const [open, setOpen] = useState<boolean | null>(null);
  const isOpen = open ?? Boolean(hasActiveChild);

  // Reset manual state when the route changes, so the group containing the
  // active child re-opens automatically on navigation.
  useEffect(() => {
    setOpen(null);
  }, [pathname]);

  const Icon = item.icon;

  if (!hasChildren) {
    const link = (
      <Link
        href={item.href}
        onClick={onNavigate}
        aria-current={isActive ? "page" : undefined}
        className={cn(
          "flex items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          isActive
            ? "bg-slate-900 text-white"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
          collapsed && "justify-center px-0"
        )}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );

    return (
      <li>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>{link}</TooltipTrigger>
            <TooltipContent side="right">{item.label}</TooltipContent>
          </Tooltip>
        ) : (
          link
        )}
      </li>
    );
  }

  return (
    <li>
      <button
        type="button"
        aria-expanded={collapsed ? undefined : isOpen}
        onClick={() => {
          if (collapsed) {
            onRequestExpand?.();
          } else {
            setOpen(!isOpen);
          }
        }}
        className={cn(
          "flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          isActive || hasActiveChild
            ? "text-slate-900"
            : "text-slate-700 hover:bg-slate-100 hover:text-slate-900",
          collapsed && "justify-center px-0"
        )}
      >
        {Icon && <Icon className="size-4 shrink-0" />}
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-left">{item.label}</span>
            <ChevronDown
              className={cn(
                "size-4 shrink-0 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </>
        )}
      </button>

      {!collapsed && isOpen && (
        <ul className="mt-0.5 flex flex-col gap-0.5 pl-8">
          {item.children!.map((child) => {
            const active =
              pathname === child.href ||
              pathname.startsWith(child.href + "/");
            return (
              <li key={child.href}>
                <Link
                  href={child.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "block rounded-md px-2 py-1.5 text-sm transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
                    active
                      ? "bg-slate-100 font-medium text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  {child.label}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}