"use client";

import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { FileUp, X } from "lucide-react";
import { useId, useRef } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/cn";

/**
 * Guard that works in any runtime (browser, Node, SSR) without assuming
 * that the `File` constructor is defined.
 */
function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

interface FileFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  description?: string;
  accept?: string;
  maxSizeMB?: number;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export function FileField<T extends FieldValues>({
  name,
  control,
  label,
  description,
  accept,
  maxSizeMB = 5,
  required,
  disabled,
  className,
}: FileFieldProps<T>) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => {
        // Route through `unknown` so `instanceof` is legal regardless of
        // what FieldPathValue<T, name> resolves to for a generic T.
        const rawValue: unknown = field.value;
        const file: File | null = isFile(rawValue) ? rawValue : null;

        const errorId = `${name}-error`;
        const descriptionId = `${name}-description`;
        const shownError = fieldState.error?.message;

        return (
          <div className={cn("flex flex-col gap-1.5", className)}>
            <Label htmlFor={inputId}>
              {label}
              {required && (
                <span aria-hidden="true" className="ml-0.5 text-rose-600">
                  *
                </span>
              )}
            </Label>

            <input
              ref={inputRef}
              id={inputId}
              type="file"
              accept={accept}
              disabled={disabled}
              className="sr-only"
              aria-invalid={Boolean(shownError)}
              aria-describedby={
                [shownError ? errorId : null, description ? descriptionId : null]
                  .filter(Boolean)
                  .join(" ") || undefined
              }
              onChange={(event) => {
                const picked = event.target.files?.[0] ?? null;
                if (picked && picked.size > maxSizeMB * 1024 * 1024) {
                  field.onChange(null);
                  if (inputRef.current) inputRef.current.value = "";
                  field.onBlur();
                  return;
                }
                field.onChange(picked);
              }}
            />

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                className={cn(
                  "inline-flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700",
                  "hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
                  "disabled:cursor-not-allowed disabled:opacity-50"
                )}
              >
                <FileUp className="size-4" aria-hidden="true" />
                {file ? "Replace file" : "Choose file"}
              </button>

              {file && (
                <>
                  <span className="truncate text-sm text-slate-700">
                    {file.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      field.onChange(null);
                      if (inputRef.current) inputRef.current.value = "";
                    }}
                    aria-label="Remove file"
                    className="rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                  >
                    <X className="size-3.5" aria-hidden="true" />
                  </button>
                </>
              )}
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