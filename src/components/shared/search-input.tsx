"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/lib/use-debounce";
import { cn } from "@/lib/cn";

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  /** Debounce delay in ms. Set to 0 to fire on every keystroke (rare). */
  debounceMs?: number;
  disabled?: boolean;
  className?: string;
  id?: string;
}

/**
 * A controlled search input that debounces its `onChange` callback.
 *
 * Internal state mirrors the input value immediately so typing feels instant;
 * the debounced value is what triggers `onChange`, so the network is not
 * flooded with requests.
 */
export function SearchInput({
  value,
  onChange,
  placeholder = "Search…",
  debounceMs = 300,
  disabled,
  className,
  id,
}: SearchInputProps) {
  const [local, setLocal] = useState(value);
  const debounced = useDebounce(local, debounceMs);

  // Sync back when the parent resets the value (e.g. "clear all filters").
  useEffect(() => {
    setLocal(value);
  }, [value]);

  // Only call onChange when the debounced value actually differs from the
  // parent's current value — avoids a redundant request on mount.
  useEffect(() => {
    if (debounced !== value) onChange(debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  return (
    <div className={cn("relative w-full sm:max-w-xs", className)}>
      <Search
        aria-hidden="true"
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
      />
      <Input
        id={id}
        type="search"
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className="pl-9 pr-9"
        aria-label={placeholder}
      />
      {local.length > 0 && (
        <button
          type="button"
          onClick={() => {
            setLocal("");
            onChange("");
          }}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  );
}