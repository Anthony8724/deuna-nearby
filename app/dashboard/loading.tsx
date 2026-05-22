import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-dvh bg-[#F8F9FA]">
      <div className="border-b border-black/[0.06] bg-white px-5 py-8 sm:px-8">
        <Skeleton className="h-6 w-40 rounded-full" />
        <Skeleton className="mt-4 h-9 w-72 max-w-full" />
        <Skeleton className="mt-2 h-4 w-56" />
      </div>

      <div className="mx-auto max-w-6xl px-5 py-6 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="mt-4 h-28 rounded-2xl" />
        <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
        <Skeleton className="mt-6 h-[28rem] rounded-2xl" />
      </div>
    </div>
  );
}
