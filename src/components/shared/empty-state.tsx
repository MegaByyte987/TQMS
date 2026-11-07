import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface EmptyStateAction {
  label: string;
  href?: string;
  onClick?: () => void;
}

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: EmptyStateAction;
  className?: string;
}

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      role="status"
      className={cn(
        "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-slate-300 bg-white px-6 py-12 text-center",
        className
      )}
    >
      <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-500">
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-medium text-slate-900">{title}</p>
        {description && (
          <p className="max-w-md text-sm text-slate-600">{description}</p>
        )}
      </div>
      {action && (
        <div className="mt-1">
          {action.href ? (
            <Button asChild variant="outline">
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ) : (
            <Button variant="outline" onClick={action.onClick}>
              {action.label}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}