"use client";

import React from "react";
import { Users, Wallet, Activity, CreditCard } from "lucide-react";
import { useDashboardSummary } from "../../../hooks/useAnalytics";
import { StatCard } from "../../../components/ui/stat-card";
import { Skeleton } from "../../../components/ui/loading-states";

export function SummaryCards() {
  const { data, isLoading, error } = useDashboardSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-[120px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg border border-destructive/50 p-4 text-destructive">
        Failed to load summary cards.
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Accounts"
        value={data.totalAccounts.toLocaleString()}
        icon={Users}
      />
      <StatCard
        title="Active Accounts"
        value={data.activeAccounts.toLocaleString()}
        icon={Activity}
      />
      <StatCard
        title="Total Balance"
        value={`$${data.totalBalance.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`}
        icon={Wallet}
      />
      <StatCard
        title="Total Transactions"
        value={data.totalTransactions.toLocaleString()}
        icon={CreditCard}
      />
    </div>
  );
}
