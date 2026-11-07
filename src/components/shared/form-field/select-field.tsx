"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

interface SelectFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  options: LookupOption[];
  description?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  required?: boolean;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  onSearchChange?: (query: string) => void;
}

export function SelectField<T extends FieldValues>({
  name,
  control,
  label,
  options,
  description,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  required,
  disabled,
  isLoading,
  className,
  onSearchChange,
}: SelectFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        const errorId = `${name}-error`;
        const descriptionId = `${name}-description`;
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
            <Combobox
              id={name}
              options={options}
              value={field.value ?? ""}
              onValueChange={field.onChange}
              placeholder={placeholder}
              searchPlaceholder={searchPlaceholder}
              disabled={disabled}
              isLoading={isLoading}
              onSearchChange={onSearchChange}
              aria-invalid={Boolean(fieldState.error)}
              aria-describedby={
                [fieldState.error ? errorId : null, description ? descriptionId : null]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
            />
            {description && !fieldState.error && (
              <p id={descriptionId} className="text-xs text-slate-500">
                {description}
              </p>
            )}
            {fieldState.error && (
              <p id={errorId} role="alert" className="text-xs text-rose-600">
                {fieldState.error.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );
}