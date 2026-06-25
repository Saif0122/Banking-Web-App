import React from "react";

export function AccountSkeletons() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-border bg-card p-6 shadow-sm flex flex-col justify-between h-[220px]"
        >
          <div>
            <div className="flex justify-between items-start mb-6">
              <div className="space-y-2">
                <div className="h-5 w-32 bg-muted rounded animate-pulse" />
                <div className="h-3 w-20 bg-muted rounded animate-pulse" />
              </div>
              <div className="h-5 w-16 bg-muted rounded-full animate-pulse" />
            </div>

            <div className="space-y-2 mt-4">
              <div className="h-3 w-24 bg-muted rounded animate-pulse" />
              <div className="h-8 w-40 bg-muted rounded animate-pulse" />
            </div>
          </div>

          <div className="border-t border-border pt-4 mt-6 flex justify-between items-center">
            <div className="h-5 w-24 bg-muted rounded animate-pulse" />
            <div className="h-5 w-16 bg-muted rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
