import { Skeleton } from "@/components/ui/skeleton";

export function CardGridSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading queue"
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex flex-col gap-3 rounded-[12px] border border-[var(--color-bd)] bg-[var(--color-card)] p-4"
        >
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-28 rounded-[8px]" />
            <Skeleton className="h-5 w-20 rounded-[980px]" />
          </div>
          <Skeleton className="h-3 w-full rounded-[8px]" />
          <Skeleton className="h-3 w-3/4 rounded-[8px]" />
          <Skeleton className="h-3 w-2/3 rounded-[8px]" />
          <Skeleton className="h-3 w-1/2 rounded-[8px]" />
          <div className="mt-2 flex gap-2 border-t border-[var(--color-bd)] pt-3">
            <Skeleton className="h-7 flex-1 rounded-[8px]" />
            <Skeleton className="h-7 flex-1 rounded-[8px]" />
          </div>
        </div>
      ))}
    </div>
  );
}