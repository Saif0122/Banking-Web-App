"use client";

import React from "react";
import { AnalyticsFilters as FiltersType } from "../../../types/analytics";

interface AnalyticsFiltersProps {
  filters: FiltersType;
  onChange: (filters: FiltersType) => void;
}

export function AnalyticsFilters({ filters, onChange }: AnalyticsFiltersProps) {
  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      type: e.target.value as FiltersType["type"],
    });
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: "from" | "to") => {
    onChange({
      ...filters,
      dateRange: {
        ...filters.dateRange,
        [field]: e.target.value,
      },
    });
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-sm font-medium text-muted-foreground">Transaction Type</label>
        <select
          value={filters.type || "ALL"}
          onChange={handleTypeChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="ALL">All Types</option>
          <option value="DEPOSIT">Deposits</option>
          <option value="WITHDRAWAL">Withdrawals</option>
          <option value="TRANSFER">Transfers</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-sm font-medium text-muted-foreground">From Date</label>
        <input
          type="date"
          value={filters.dateRange?.from as string || ""}
          onChange={(e) => handleDateChange(e, "from")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      <div className="flex flex-col gap-1.5 flex-1">
        <label className="text-sm font-medium text-muted-foreground">To Date</label>
        <input
          type="date"
          value={filters.dateRange?.to as string || ""}
          onChange={(e) => handleDateChange(e, "to")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>
    </div>
  );
}
