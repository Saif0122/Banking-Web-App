"use client";

import React from "react";
import { ShieldAlert, Users, Landmark, Activity, Server, ArrowUpRight, Loader2 } from "lucide-react";
import { StatCard } from "@/components/ui/stat-card";
import { AnimatedCard } from "@/components/ui/animated-card";
import { DataTable } from "@/components/ui/data-table";
import { motion } from "framer-motion";
import { useAdminOverview, useAuditLogs } from "@/hooks/useAdmin";

export default function AdminDashboardPage() {
  const { data: overview, isLoading: isOverviewLoading } = useAdminOverview();
  const { data: auditLogs, isLoading: isLogsLoading } = useAuditLogs(1, 5);

  const adminStats = [
    { title: "Total Users", value: (overview?.totalUsers || 0).toString(), icon: Users, trend: "neutral" as const },
    { title: "Total Accounts", value: (overview?.totalAccounts || 0).toString(), icon: Landmark, trend: "neutral" as const },
    { title: "Total Transactions", value: (overview?.totalTransactions || 0).toString(), icon: Activity, trend: "neutral" as const },
    { title: "Blocked Users", value: (overview?.blockedUsers || 0).toString(), icon: ShieldAlert, trend: "neutral" as const },
  ];

  const logColumns = [
    { header: "Time", accessorKey: "timestamp" as const, cell: (row: any) => <span className="text-muted-foreground font-mono text-xs">{new Date(row.timestamp).toLocaleTimeString()}</span> },
    { header: "Action", accessorKey: "action" as const, cell: (row: any) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-muted text-muted-foreground">
        {row.action}
      </span>
    )},
    { header: "User ID", accessorKey: "userId" as const, cell: (row: any) => <span className="text-primary font-mono text-xs">[{typeof row.userId === 'string' ? row.userId.substring(0, 8) : row.userId?.id?.substring(0, 8) || "System"}]</span> },
    { header: "IP", accessorKey: "ipAddress" as const, cell: (row: any) => <span className="text-sm truncate max-w-[300px] block">{row.ipAddress}</span> },
  ];

  if (isOverviewLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-red-500" />
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
      className="space-y-8"
    >
      {/* Title */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Admin Console</h2>
          <p className="text-muted-foreground text-sm mt-1">
            System performance metrics, user overview, and recent actions.
          </p>
        </div>
      </motion.div>

      {/* Admin stats */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {adminStats.map((stat, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <StatCard {...stat} className={stat.title === "Blocked Users" ? "border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : ""} />
          </motion.div>
        ))}
      </div>

      {/* Columns */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Logs */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex justify-between items-center px-1">
            <h3 className="font-semibold text-lg tracking-tight">Recent Audit Logs</h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
              <Server className="h-3 w-3" />
              <span>Live Feed</span>
            </span>
          </div>
          {isLogsLoading ? (
             <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
          ) : (
             <DataTable data={auditLogs?.data || []} columns={logColumns} />
          )}
        </div>

        {/* System Health */}
        <AnimatedCard className="p-6 md:col-span-1 space-y-6">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-lg tracking-tight">Financial Overview</h3>
          </div>
          
          <div className="space-y-5">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Total Funds</span>
                <span className="text-emerald-500">${overview?.totalFunds?.toLocaleString() || "0.00"}</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Active Accounts</span>
                <span>{overview?.activeAccounts || 0}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${overview?.totalAccounts ? ((overview.activeAccounts || 0) / overview.totalAccounts) * 100 : 0}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  className="h-full bg-emerald-500 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm font-medium">
                <span className="text-muted-foreground">Frozen Accounts</span>
                <span className="text-yellow-500">{overview?.frozenAccounts || 0}</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${overview?.totalAccounts ? ((overview.frozenAccounts || 0) / overview.totalAccounts) * 100 : 0}%` }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  className="h-full bg-yellow-500 rounded-full"
                />
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </motion.div>
  );
}
