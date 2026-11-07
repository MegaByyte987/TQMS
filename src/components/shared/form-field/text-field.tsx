"use client";

import { Controller, type Control, type FieldPath, type FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

interface TextFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  description?: string;
  placeholder?: string;
  type?: React.ComponentProps<"input">["type"];
  required?: boolean;
  disabled?: boolean;
  /**
   * When true, the browser's string value is converted to a number before
   * being handed to React Hook Form. Empty input becomes undefined so the
   * schema's `error` message fires instead of a NaN validation error.
   */
  valueAsNumber?: boolean;
  className?: string;
}

export function TextField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  placeholder,
  type = "text",
  required,
  disabled,
  valueAsNumber = false,
  className,
}: TextFieldProps<T>) {
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
            <Input
              id={name}
              type={type}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={Boolean(fieldState.error)}
              aria-required={required}
              aria-describedby={
                [fieldState.error ? errorId : null, description ? descriptionId : null]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              {...field}
              value={field.value ?? ""}
              onChange={
                valueAsNumber
                  ? (event) => {
                      const raw = event.target.value;
                      field.onChange(raw === "" ? undefined : Number(raw));
                    }
                  : field.onChange
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