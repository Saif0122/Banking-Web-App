"use client";

import React, { useMemo } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useMonthlyAnalytics } from "../../../hooks/useAnalytics";
import { Card } from "../../../components/ui/card";
import { Skeleton } from "../../../components/ui/loading-states";

const COLORS = ["#10b981", "#ef4444", "#3b82f6"];

export function TransactionDistributionChart() {
  const { data, isLoading, error } = useMonthlyAnalytics();

  const chartData = useMemo(() => {
    if (!data?.data) return [];
    
    let totalDeposits = 0;
    let totalWithdrawals = 0;
    let totalTransfers = 0;

    data.data.forEach((month) => {
      totalDeposits += month.deposits;
      totalWithdrawals += month.withdrawals;
      totalTransfers += month.transfers;
    });

    return [
      { name: "Deposits", value: totalDeposits },
      { name: "Withdrawals", value: totalWithdrawals },
      { name: "Transfers", value: totalTransfers },
    ].filter(item => item.value > 0);
  }, [data]);

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full rounded-xl" />;
  }

  if (error) {
    return (
      <Card className="flex h-[400px] items-center justify-center p-6 text-destructive">
        Failed to load transaction distribution.
      </Card>
    );
  }

  if (chartData.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Transaction Distribution</h3>
        <p className="text-sm text-muted-foreground">Volume by transaction type</p>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: "hsl(var(--card))", borderColor: "hsl(var(--border))", borderRadius: "8px" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
              formatter={(value: any) => `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
