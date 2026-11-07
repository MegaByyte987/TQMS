import {
  BadgeCheck,
  ClipboardList,
  FileText,
  PlusCircle,
  QrCode,
  Truck,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon?: LucideIcon;
  children?: NavItem[];
}

export interface Breadcrumb {
  label: string;
  href: string;
}

export const NAV_TREE: NavItem[] = [
  {
    label: "Checkpoints",
    href: "/checkpoints",
    icon: BadgeCheck,
    children: [
      { label: "Check User", href: "/checkpoints/users" },
      { label: "Narration", href: "/checkpoints/narrations" },
    ],
  },
  { label: "Queue", href: "/queue", icon: ClipboardList },
  { label: "Add New Queue", href: "/queue/new", icon: PlusCircle },
  {
    label: "Vehicle",
    href: "/vehicle",
    icon: Truck,
    children: [
      { label: "Vehicle Owner", href: "/vehicle/owners" },
      { label: "Vehicles", href: "/vehicle/vehicles" },
      { label: "Other's Vehicle", href: "/vehicle/others" },
    ],
  },
  {
    label: "Reports",
    href: "/reports",
    icon: FileText,
    children: [
      { label: "Checkpoint Entry", href: "/reports/checkpoint-entry" },
      { label: "Detail Entry Report", href: "/reports/detail-entry" },
    ],
  },
  { label: "Generate QR", href: "/qr", icon: QrCode },
];


export function getBreadcrumbs(pathname: string): Breadcrumb[] {
  for (const top of NAV_TREE) {
    if (top.href === pathname) {
      return [{ label: top.label, href: top.href }];
    }
    for (const child of top.children ?? []) {
      if (child.href === pathname) {
        return [
          { label: top.label, href: top.href },
          { label: child.label, href: child.href },
        ];
      }
    }
  }

  for (const top of NAV_TREE) {
    if (pathname.startsWith(top.href + "/")) {
      const trail: Breadcrumb[] = [{ label: top.label, href: top.href }];
      for (const child of top.children ?? []) {
        if (pathname.startsWith(child.href + "/")) {
          trail.push({ label: child.label, href: child.href });
        }
      }
      return trail;
    }
  }

  return [];
}