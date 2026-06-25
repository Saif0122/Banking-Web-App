"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useMonthlyAnalytics } from "../../../hooks/useAnalytics";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/loading-states";

export function BalanceOverviewChart() {
  const { data, isLoading, error } = useMonthlyAnalytics();

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />;
  }

  if (error) {
    return (
      <Card className="flex h-[400px] items-center justify-center p-6 text-destructive">
        Failed to load balance overview.
      </Card>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return null;
  }

  // Derive a cumulative balance trend for visualization purposes from monthly net flow
  let currentBalance = 0; // Baseline at 0 to show net flow
  const trendData = [...data.data].map((month) => {
    const netFlow = month.deposits - month.withdrawals - month.transfers;
    currentBalance += netFlow;
    return {
      month: month.month,
      balance: currentBalance,
    };
  });

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Balance Overview</h3>
        <p className="text-sm text-muted-foreground">Cumulative balance trend over time</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trendData}
            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Area type="monotone" dataKey="balance" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorBalance)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
