"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { Fragment } from "react";
import { getBreadcrumbs } from "@/lib/routes";

export function Breadcrumbs() {
  const pathname = usePathname();
  const trail = getBreadcrumbs(pathname);

  if (trail.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="min-w-0">
      <ol className="flex items-center gap-1.5 text-sm">
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;
          return (
            <Fragment key={crumb.href}>
              {index > 0 && (
                <li aria-hidden="true" className="text-[var(--color-mut)]">
                  <ChevronRight className="size-3.5" />
                </li>
              )}
              <li className="min-w-0">
                {isLast ? (
                  <span
                    aria-current="page"
                    className="truncate font-medium text-[var(--color-fg)]"
                  >
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="truncate text-[var(--color-mut)] hover:text-[var(--color-fg)] hover:underline"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}