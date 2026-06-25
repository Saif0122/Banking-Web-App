"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ShieldCheck, ShieldAlert, AlertCircle, Calendar, History } from "lucide-react";
import { useAccount } from "@/hooks/useAccounts";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/ui/animated-card";
import { QuickActions } from "@/components/accounts/QuickActions";
import { AccountSkeletons } from "@/components/accounts/AccountSkeletons";
import { AxiosError } from "axios";

import { useTransactions } from "@/features/transactions/api/useTransactions";
import { TransactionTable } from "@/features/transactions/components/TransactionTable";
import { TransactionDetailsModal } from "@/features/transactions/components/TransactionDetailsModal";
import { Transaction } from "@/types";

export default function AccountDetailsPage() {
  const { id } = useParams() as { id: string };
  const router = useRouter();
  const { data: account, isLoading, isError, error, refetch } = useAccount(id);
  
  const { data: transactions = [], isLoading: transactionsLoading } = useTransactions(id);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-32 bg-muted rounded animate-pulse" />
        <AccountSkeletons />
      </div>
    );
  }

  if (isError || !account) {
    return (
      <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 flex items-start gap-4">
        <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
        <div>
          <h3 className="font-semibold text-destructive">Failed to load account details</h3>
          <p className="text-sm text-destructive/80 mt-1">
            {(error as AxiosError | Error)?.message || "An unexpected error occurred."}
          </p>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" size="sm" onClick={() => refetch()} className="border-destructive/50 text-destructive hover:bg-destructive/20">
              Try Again
            </Button>
            <Button variant="ghost" size="sm" onClick={() => router.push("/accounts")}>
              Back to Accounts
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isNegative = account.balance < 0;
  const isActive = account.status === "active";

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.push("/accounts")}
          className="rounded-full hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{account.name}</h2>
          <p className="text-sm text-muted-foreground font-mono">
            Account #{account.accountNumber}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {/* Main Balance Card */}
        <AnimatedCard className="md:col-span-2 lg:col-span-3 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all duration-700" />
          
          <div className="flex justify-between items-start mb-8 relative z-10">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-1">
                Available Balance
              </p>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight">
                {isNegative ? "-" : ""}$
                {Math.abs(account.balance).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </h3>
            </div>
            
            <div
              className={`rounded-full px-3 py-1 text-xs font-semibold flex items-center gap-1.5 shadow-sm
                ${isActive ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border border-amber-500/20"}`}
            >
              {isActive ? <ShieldCheck className="h-4 w-4" /> : <ShieldAlert className="h-4 w-4" />}
              <span className="capitalize">{account.status}</span>
            </div>
          </div>

          <div className="flex gap-6 mt-auto relative z-10">
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">Account Type</span>
              <span className="font-semibold capitalize">{account.accountType}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">Currency</span>
              <span className="font-semibold uppercase">{account.currency || "USD"}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground mb-1">Opened On</span>
              <span className="font-semibold flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                {new Date(account.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            </div>
          </div>
        </AnimatedCard>

        {/* Quick Actions Panel */}
        <div className="md:col-span-1 lg:col-span-1 flex flex-col gap-4">
          <h3 className="font-semibold text-lg px-1">Quick Actions</h3>
          <QuickActions accountId={account._id} />
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-border">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold tracking-tight">Recent Transactions</h3>
          <Button variant="outline" size="sm" onClick={() => router.push('/transactions')}>View All</Button>
        </div>
        
        <TransactionTable
          transactions={transactions}
          isLoading={transactionsLoading}
          onRowClick={(tx) => setSelectedTransaction(tx)}
        />
        
        <TransactionDetailsModal
          transaction={selectedTransaction}
          open={!!selectedTransaction}
          onOpenChange={(open) => {
            if (!open) setSelectedTransaction(null);
          }}
        />
      </div>
    </div>
  );
}
