import { CardSkeleton, TableSkeleton, Skeleton } from "@/components/ui/loading-states";

export default function AdminLoading() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
        <CardSkeleton />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <TableSkeleton />
        </div>
        <div>
          <Skeleton className="h-6 w-48 mb-4" />
          <TableSkeleton />
        </div>
      </div>
    </div>
  );
}
