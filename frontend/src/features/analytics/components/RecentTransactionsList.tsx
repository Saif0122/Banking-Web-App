"use client";

import React from "react";
import { useRecentTransactions } from "../../../hooks/useAnalytics";
import { Card } from "../../../components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import { TableSkeleton } from "../../../components/ui/loading-states";
import { cn } from "../../../lib/utils";
import { format } from "date-fns";

export function RecentTransactionsList() {
  const { data, isLoading, error } = useRecentTransactions();

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <Card className="flex h-[300px] items-center justify-center p-6 text-destructive">
        Failed to load recent transactions.
      </Card>
    );
  }

  if (!data?.transactions || data.transactions.length === 0) {
    return (
      <Card className="flex h-[300px] items-center justify-center p-6 text-muted-foreground">
        No recent transactions found.
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Recent Transactions</h3>
        <p className="text-sm text-muted-foreground">Latest activity across accounts</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell className="text-muted-foreground">
                {format(new Date(transaction.date), "MMM d, yyyy")}
              </TableCell>
              <TableCell className="font-medium">{transaction.description}</TableCell>
              <TableCell>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
                    {
                      "bg-emerald-100 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-400":
                        transaction.type === "DEPOSIT",
                      "bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-400":
                        transaction.type === "WITHDRAWAL",
                      "bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-400":
                        transaction.type === "TRANSFER",
                    }
                  )}
                >
                  {transaction.type}
                </span>
              </TableCell>
              <TableCell>
                <span
                  className={cn("text-xs font-medium", {
                    "text-emerald-500": transaction.status === "COMPLETED",
                    "text-amber-500": transaction.status === "PENDING",
                    "text-red-500": transaction.status === "FAILED",
                  })}
                >
                  {transaction.status}
                </span>
              </TableCell>
              <TableCell className="text-right font-semibold">
                <span
                  className={
                    transaction.type === "WITHDRAWAL" || transaction.type === "TRANSFER"
                      ? "text-red-500"
                      : "text-emerald-500"
                  }
                >
                  {transaction.type === "WITHDRAWAL" || transaction.type === "TRANSFER" ? "-" : "+"}
                  ${Math.abs(transaction.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
