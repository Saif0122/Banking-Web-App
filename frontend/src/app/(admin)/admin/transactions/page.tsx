"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useTransactions } from "@/hooks/useAdmin";
import { Loader2, Search, ArrowUpRight, ArrowDownLeft, RefreshCcw, Eye, Activity } from "lucide-react";
import { Transaction } from "@/types";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AdminTransactionsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: transactionsData, isLoading } = useTransactions(page, 10, typeFilter, statusFilter, search);

  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);

  const columns = [
    { header: "ID", accessorKey: "id" as const, cell: (row: Transaction) => <span className="font-mono text-xs">{row.id || row._id}</span> },
    { header: "Date", accessorKey: "createdAt" as const, cell: (row: Transaction) => <span className="text-sm">{new Date(row.createdAt).toLocaleString()}</span> },
    { header: "Type", accessorKey: "type" as const, cell: (row: Transaction) => {
      const typeConfig = {
        deposit: { icon: ArrowDownLeft, color: "text-emerald-500 bg-emerald-500/10" },
        withdrawal: { icon: ArrowUpRight, color: "text-red-500 bg-red-500/10" },
        transfer: { icon: RefreshCcw, color: "text-blue-500 bg-blue-500/10" },
      };
      const config = typeConfig[row.type as keyof typeof typeConfig] || { icon: Activity, color: "text-zinc-500 bg-zinc-800" };
      const Icon = config.icon;
      return (
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold capitalize ${config.color}`}>
          <Icon className="h-3 w-3" /> {row.type}
        </span>
      );
    }},
    { header: "Amount", accessorKey: "amount" as const, cell: (row: Transaction) => (
      <span className={`font-semibold ${row.type === 'withdrawal' || row.type === 'transfer' ? 'text-red-500' : 'text-emerald-500'}`}>
        {row.type === 'withdrawal' || row.type === 'transfer' ? '-' : '+'}${Math.abs(row.amount).toLocaleString()}
      </span>
    )},
    { header: "Status", accessorKey: "status" as const, cell: (row: Transaction) => {
      const colors = {
        completed: "text-emerald-500",
        pending: "text-yellow-500",
        failed: "text-red-500",
      };
      return <span className={`capitalize font-medium ${colors[row.status as keyof typeof colors]}`}>{row.status}</span>;
    }},
    { header: "Action", accessorKey: "id" as const, cell: (row: Transaction) => (
      <button onClick={() => setSelectedTx(row)} className="p-2 text-zinc-400 hover:text-primary hover:bg-primary/10 rounded-md transition-colors" title="View Details">
        <Eye className="h-4 w-4" />
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Transaction Monitoring</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor all platform transactions and filter for anomalies.
        </p>
      </div>

      <AnimatedCard className="p-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input 
                type="text" 
                placeholder="Search description or ID..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-background border border-zinc-800 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-background border border-zinc-800 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Types</option>
              <option value="deposit">Deposit</option>
              <option value="withdrawal">Withdrawal</option>
              <option value="transfer">Transfer</option>
            </select>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-background border border-zinc-800 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Statuses</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
             <DataTable data={transactionsData?.data || []} columns={columns} />
             <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
               <div>Showing page {transactionsData?.page || 1} of {transactionsData?.totalPages || 1}</div>
               <div className="flex gap-2">
                 <button 
                   disabled={page === 1}
                   onClick={() => setPage(p => Math.max(1, p - 1))}
                   className="px-3 py-1 rounded-md bg-zinc-800 disabled:opacity-50"
                 >
                   Previous
                 </button>
                 <button 
                   disabled={page === (transactionsData?.totalPages || 1)}
                   onClick={() => setPage(p => p + 1)}
                   className="px-3 py-1 rounded-md bg-zinc-800 disabled:opacity-50"
                 >
                   Next
                 </button>
               </div>
             </div>
          </div>
        )}
      </AnimatedCard>

      <Dialog open={!!selectedTx} onOpenChange={() => setSelectedTx(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Detailed view of transaction record.
            </DialogDescription>
          </DialogHeader>
          {selectedTx && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 py-4 border-y border-zinc-800">
                <div>
                  <span className="text-muted-foreground block text-xs">Transaction ID</span>
                  <span className="font-mono">{selectedTx.id || selectedTx._id}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Date</span>
                  <span>{new Date(selectedTx.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Account ID</span>
                  <span className="font-mono">{selectedTx.accountId}</span>
                </div>
                {selectedTx.toAccountId && (
                  <div>
                    <span className="text-muted-foreground block text-xs">To Account ID</span>
                    <span className="font-mono">{selectedTx.toAccountId}</span>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground block text-xs">Amount</span>
                  <span className="font-semibold">${selectedTx.amount.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-xs">Category</span>
                  <span className="capitalize">{selectedTx.category}</span>
                </div>
              </div>
              <div>
                <span className="text-muted-foreground block text-xs">Description</span>
                <span>{selectedTx.description}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
