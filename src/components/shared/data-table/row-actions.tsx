"use client";

import { Eye, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RowActionsProps {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  viewLabel?: string;
  editLabel?: string;
  deleteLabel?: string;
}

export function RowActions({
  onView,
  onEdit,
  onDelete,
  viewLabel = "Details",
  editLabel = "Edit",
  deleteLabel = "Delete",
}: RowActionsProps) {
  return (
    <div className="flex items-center justify-end gap-0.5">
      {onView && (
        <ActionButton
          label={viewLabel}
          icon={Eye}
          onClick={onView}
        />
      )}
      {onEdit && (
        <ActionButton
          label={editLabel}
          icon={Pencil}
          onClick={onEdit}
        />
      )}
      {onDelete && (
        <ActionButton
          label={deleteLabel}
          icon={Trash2}
          onClick={onDelete}
          variant="destructive"
        />
      )}
    </div>
  );
}

function ActionButton({
  label,
  icon: Icon,
  onClick,
  variant = "default",
}: {
  label: string;
  icon: typeof Eye;
  onClick: () => void;
  variant?: "default" | "destructive";
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={onClick}
          aria-label={label}
          className={
            variant === "destructive"
              ? "text-slate-500 hover:bg-rose-50 hover:text-rose-600"
              : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          }
        >
          <Icon className="size-4" aria-hidden="true" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}