"use client";

import React, { useState } from "react";
import { AnalyticsFilters } from "../../../features/analytics/components/AnalyticsFilters";
import { SummaryCards } from "../../../features/analytics/components/SummaryCards";
import { MonthlyAnalyticsChart } from "../../../features/analytics/components/MonthlyAnalyticsChart";
import { BalanceOverviewChart } from "../../../features/analytics/components/BalanceOverviewChart";
import { TransactionDistributionChart } from "../../../features/analytics/components/TransactionDistributionChart";
import { AccountStats } from "../../../features/analytics/components/AccountStats";
import { RecentTransactionsList } from "../../../features/analytics/components/RecentTransactionsList";
import { AnalyticsFilters as FiltersType } from "../../../types/analytics";

export default function AnalyticsPage() {
  const [filters, setFilters] = useState<FiltersType>({
    type: "ALL",
  });

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Analytics Dashboard</h2>
        <p className="text-muted-foreground text-sm">
          Comprehensive insights into your accounts, transactions, and cash flows.
        </p>
      </div>

      {/* Filters */}
      <AnalyticsFilters filters={filters} onChange={setFilters} />

      {/* Summary Metrics Row */}
      <SummaryCards />

      {/* Main Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        <BalanceOverviewChart />
        <MonthlyAnalyticsChart />
      </div>

      {/* Secondary Row: Distribution & Stats */}
      <div className="grid gap-6 lg:grid-cols-2">
        <TransactionDistributionChart />
        <AccountStats />
      </div>

      {/* Recent Transactions Table */}
      <RecentTransactionsList />
    </div>
  );
}
