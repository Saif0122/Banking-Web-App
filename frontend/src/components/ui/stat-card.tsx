import * as React from "react";
import { AnimatedCard } from "./animated-card";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  className?: string;
}

export function StatCard({ title, value, icon: Icon, trend, trendValue, className }: StatCardProps) {
  return (
    <AnimatedCard className={cn("p-6", className)}>
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex flex-col gap-1">
        <div className="text-2xl font-bold">{value}</div>
        {trend && trendValue && (
          <p className={cn(
            "text-xs",
            trend === "up" ? "text-emerald-500" : trend === "down" ? "text-destructive" : "text-muted-foreground"
          )}>
            {trend === "up" && "+"}
            {trend === "down" && "-"}
            {trendValue} from last month
          </p>
        )}
      </div>
    </AnimatedCard>
  );
}
