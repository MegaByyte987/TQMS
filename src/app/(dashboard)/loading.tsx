import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="h-8 w-48 rounded-[8px]" />
      <Skeleton className="h-4 w-72 rounded-[8px]" />
      <Skeleton className="h-64 w-full rounded-[12px]" />
    </div>
  );
}