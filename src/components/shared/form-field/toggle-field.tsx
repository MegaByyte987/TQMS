"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/cn";

interface ToggleFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export function ToggleField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  disabled,
  className,
}: ToggleFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const errorId = `${name}-error`;
        const descriptionId = `${name}-description`;
        const shownError = fieldState.error?.message;

        return (
          <div className={cn("flex flex-col gap-1.5", className)}>
            <div className="flex items-center gap-2">
              <Switch
                id={name}
                checked={Boolean(field.value)}
                onCheckedChange={field.onChange}
                disabled={disabled}
                aria-describedby={
                  [shownError ? errorId : null, description ? descriptionId : null]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
              />
              <Label htmlFor={name} className="cursor-pointer">
                {label}
              </Label>
            </div>
            {description && !shownError && (
              <p id={descriptionId} className="text-xs text-slate-500">
                {description}
              </p>
            )}
            {shownError && (
              <p id={errorId} role="alert" className="text-xs text-rose-600">
                {shownError}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}