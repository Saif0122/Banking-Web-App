"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { StatCard } from "@/components/ui/stat-card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { AnimatedButton } from "@/components/ui/animated-button";
import dynamic from "next/dynamic";
import type { Column, DataTableProps } from "@/components/ui/data-table";
import { useDashboardSummary, useRecentTransactions } from "@/hooks/useAnalytics";
import { AnalyticsTransaction } from "@/types/analytics";

const DataTable = dynamic(() => import("@/components/ui/data-table").then(mod => mod.DataTable), {
  ssr: false,
  loading: () => <div className="h-64 flex items-center justify-center border rounded-xl bg-muted/20 animate-pulse">Loading data...</div>
}) as <T>(props: DataTableProps<T>) => React.ReactElement;
import {
  Plus,
  Send,
  Download,
  ArrowRight,
  Landmark,
  Wallet,
  Activity
} from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: recentTxData, isLoading: isLoadingTx } = useRecentTransactions();

  const summaryCards = [
    { title: "Total Balance", value: `$${(summary?.totalBalance || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`, icon: Wallet },
    { title: "Total Accounts", value: (summary?.totalAccounts || 0).toString(), icon: Landmark },
    { title: "Total Transactions", value: (summary?.totalTransactions || 0).toString(), icon: Activity },
  ];

  const columns: Column<AnalyticsTransaction>[] = [
    { header: "Description", accessorKey: "description" as const, cell: (row: AnalyticsTransaction) => <span className="font-medium">{row.description}</span> },
    { header: "Date", accessorKey: "date" as const, cell: (row: AnalyticsTransaction) => <span>{format(new Date(row.date), "MMM d, yyyy")}</span> },
    { header: "Type", accessorKey: "type" as const },
    { header: "Status", accessorKey: "status" as const, cell: (row: AnalyticsTransaction) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.status === 'COMPLETED' ? 'bg-emerald-500/10 text-emerald-500' : row.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500' : 'bg-red-500/10 text-red-500'}`}>
        {row.status}
      </span>
    )},
    { header: "Amount", accessorKey: "amount" as const, cell: (row: AnalyticsTransaction) => {
      const isNegative = row.type === "WITHDRAWAL" || row.type === "TRANSFER";
      return (
        <span className={`font-semibold ${isNegative ? "text-foreground" : "text-emerald-500"}`}>
          {isNegative ? "-" : "+"}${Math.abs(row.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </span>
      );
    }},
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="space-y-8"
    >
      {/* Greeting Header */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, {user?.name}</h2>
          <p className="text-muted-foreground mt-1">
            Here is your financial overview for today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatedButton className="h-10 px-4" onClick={() => router.push('/accounts/create')}>
            <Plus className="mr-2 h-4 w-4" />
            Open Account
          </AnimatedButton>
        </div>
      </motion.div>

      {/* Accounts Summary Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {isLoadingSummary ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 rounded-xl bg-muted/20 animate-pulse border border-border" />
          ))
        ) : (
          summaryCards.map((acc, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <StatCard {...acc} />
            </motion.div>
          ))
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Quick Actions Panel */}
        <AnimatedCard className="p-6 md:col-span-1 flex flex-col space-y-4">
          <div className="flex items-center gap-2 text-lg font-semibold tracking-tight">
            <Activity className="h-5 w-5 text-primary" />
            <h3>Quick Actions</h3>
          </div>
          <div className="grid grid-cols-2 gap-3 flex-1">
            <button onClick={() => router.push('/transactions')} className="flex flex-col items-center justify-center p-4 rounded-xl border bg-muted/30 hover:bg-muted text-foreground transition-all group">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-2">
                <Send className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Send</span>
            </button>
            <button onClick={() => router.push('/transactions')} className="flex flex-col items-center justify-center p-4 rounded-xl border bg-muted/30 hover:bg-muted text-foreground transition-all group">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-2">
                <Download className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Receive</span>
            </button>
            <button onClick={() => router.push('/transactions')} className="flex flex-col items-center justify-center p-4 rounded-xl border bg-muted/30 hover:bg-muted text-foreground transition-all group col-span-2">
              <div className="p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors mb-2">
                <Plus className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Top Up Account</span>
            </button>
          </div>
        </AnimatedCard>

        {/* Recent Transactions Panel */}
        <div className="md:col-span-2 lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-semibold text-lg tracking-tight">Recent Transactions</h3>
            <button onClick={() => router.push('/transactions')} className="text-sm font-medium text-primary flex items-center gap-1 hover:underline">
              View all
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          {isLoadingTx ? (
             <div className="h-64 flex items-center justify-center border rounded-xl bg-muted/20 animate-pulse">Loading data...</div>
          ) : (
             <DataTable data={recentTxData?.transactions || []} columns={columns} />
          )}
        </div>
      </div>
    </motion.div>
  );
}

