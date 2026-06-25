"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useAccountStats } from "../../../hooks/useAnalytics";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/loading-states";

const COLORS = ["#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"];

export function AccountStats() {
  const { data, isLoading, error } = useAccountStats();

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />;
  }

  if (error) {
    return (
      <Card className="flex h-[400px] items-center justify-center p-6 text-destructive">
        Failed to load account statistics.
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  const chartData = [
    { name: "Savings", value: data.savingsAccounts },
    { name: "Current", value: data.currentAccounts },
    { name: "Active", value: data.activeAccounts },
    { name: "Frozen", value: data.frozenAccounts },
  ].filter((item) => item.value > 0);

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Account Statistics</h3>
        <p className="text-sm text-muted-foreground">Distribution of account types</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
