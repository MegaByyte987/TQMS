"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isBSDate, todayBS } from "@/lib/bs-date";
import { cn } from "@/lib/cn";

interface DateBSFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  min?: string;
  max?: string;
  className?: string;
}

export function DateBSField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  required,
  disabled,
  min,
  max,
  className,
}: DateBSFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const errorId = `${name}-error`;
        const descriptionId = `${name}-description`;
        const formatError = field.value && typeof field.value === "string" && !isBSDate(field.value) &&
          "Enter a valid BS date (YYYY-MM-DD).";
        const shownError = fieldState.error?.message ?? formatError;

        return (
          <div className={cn("flex flex-col gap-1.5", className)}>
            <Label htmlFor={name}>
              {label}
              {required && (
                <span aria-hidden="true" className="ml-0.5 text-rose-600">
                  *
                </span>
              )}
            </Label>
            <div className="flex gap-2">
              <Input
                id={name}
                type="text"
                inputMode="numeric"
                placeholder="2083-07-20"
                pattern="\d{4}-\d{2}-\d{2}"
                disabled={disabled}
                min={min}
                max={max}
                aria-invalid={Boolean(shownError)}
                aria-required={required}
                aria-describedby={
                  [shownError ? errorId : null, description ? descriptionId : null]
                    .filter(Boolean)
                    .join(" ") || undefined
                }
                {...field}
                value={field.value ?? ""}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={() => field.onChange(todayBS())}
                aria-label="Set to today"
                className="shrink-0"
              >
                <CalendarDays className="size-4" aria-hidden="true" />
                <span className="hidden sm:inline">Today</span>
              </Button>
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