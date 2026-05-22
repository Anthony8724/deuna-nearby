import { Skeleton } from "./skeleton";

export function DashboardSkeleton() {
  return (
    <div className="min-h-full bg-white px-5 pb-24 pt-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-12 w-12 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-5 w-36" />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>

      <Skeleton className="mt-5 h-44 rounded-xl" />
      <Skeleton className="mt-5 h-56 rounded-xl" />
      <Skeleton className="mt-5 h-40 rounded-xl" />
      <Skeleton className="mt-5 h-48 rounded-xl" />
    </div>
  );
}
