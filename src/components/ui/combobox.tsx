"use client";

import { Command } from "cmdk";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Popover } from "radix-ui";
import { useId, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

interface ComboboxProps {
  options: LookupOption[];
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  isLoading?: boolean;
  /** When provided, filtering is delegated to the server. */
  onSearchChange?: (query: string) => void;
  className?: string;
  id?: string;
  "aria-invalid"?: boolean;
  "aria-describedby"?: string;
}

function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Select…",
  searchPlaceholder = "Search…",
  emptyMessage = "No results found.",
  disabled = false,
  isLoading = false,
  onSearchChange,
  className,
  id,
  ...aria
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const listId = useId();
  const selected = options.find((option) => option.value === value);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          disabled={disabled}
          className={cn(
            "w-full justify-between font-normal",
            !selected && "text-slate-400",
            className
          )}
          {...aria}
        >
          <span className="truncate">{selected ? selected.label : placeholder}</span>
          {isLoading ? (
            <Loader2 className="size-4 animate-spin opacity-60" />
          ) : (
            <ChevronsUpDown className="size-4 opacity-50" />
          )}
        </Button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={4}
          className="z-50 w-[var(--radix-popover-trigger-width)] rounded-md border border-slate-200 bg-white p-0 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
        >
          <Command
            id={listId}
            shouldFilter={!onSearchChange}
            loop
            className="flex w-full flex-col overflow-hidden rounded-md"
          >
            <Command.Input
              placeholder={searchPlaceholder}
              onValueChange={onSearchChange}
              className="h-9 w-full border-0 border-b border-slate-100 bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
            <Command.List className="max-h-64 overflow-y-auto overflow-x-hidden p-1">
              {isLoading && (
                <div className="flex items-center justify-center gap-2 py-4 text-sm text-slate-500">
                  <Loader2 className="size-4 animate-spin" />
                  Loading…
                </div>
              )}
              <Command.Empty className="py-6 text-center text-sm text-slate-500">
                {emptyMessage}
              </Command.Empty>
              {options.map((option) => (
                <Command.Item
                  key={option.value}
                  value={option.value}
                  keywords={[option.label]}
                  onSelect={() => {
                    onValueChange(option.value);
                    setOpen(false);
                  }}
                  className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-slate-900 outline-none data-[selected=true]:bg-slate-100 data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50"
                >
                  <Check
                    className={cn(
                      "size-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{option.label}</span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

export { Combobox };
export type { ComboboxProps };