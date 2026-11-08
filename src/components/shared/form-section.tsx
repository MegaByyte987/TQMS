import { cn } from "@/lib/cn";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
}: FormSectionProps) {
  return (
    <fieldset className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-0.5">
        <legend className="text-sm font-semibold text-[var(--color-fg)]">
          {title}
        </legend>
        {description && (
          <p className="text-xs text-[var(--color-mut)]">{description}</p>
        )}
      </div>
      {children}
    </fieldset>
  );
}