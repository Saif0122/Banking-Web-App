"use client";

import React, { useState } from "react";
import Link from "next/link";
import { CreditCard, Landmark, Plus, AlertCircle } from "lucide-react";
import { useAccounts } from "@/hooks/useAccounts";
import { AccountCard } from "@/components/accounts/AccountCard";
import { EmptyState } from "@/components/accounts/EmptyState";
import { AccountSkeletons } from "@/components/accounts/AccountSkeletons";
import { Button } from "@/components/ui/button";
import { AxiosError } from "axios";

export default function AccountsPage() {
  const [filter, setFilter] = useState<"all" | "checking" | "savings" | "credit">("all");
  const { data: accounts, isLoading, isError, error, refetch } = useAccounts();

  const filteredAccounts = accounts?.filter(
    (acc) => filter === "all" || acc.accountType === filter
  ) || [];

  const totalAssets = accounts
    ?.filter((acc) => acc.balance > 0)
    .reduce((sum, acc) => sum + acc.balance, 0) || 0;

  const totalLiabilities = accounts
    ?.filter((acc) => acc.balance < 0)
    .reduce((sum, acc) => sum + Math.abs(acc.balance), 0) || 0;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Accounts</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Review your financial assets, credit balances, and limits in one secure location.
          </p>
        </div>
        <Link href="/accounts/create" passHref>
          <Button className="flex items-center gap-2 font-semibold shadow-lg shadow-primary/20">
            <Plus className="h-4 w-4" />
            <span>New Account</span>
          </Button>
        </Link>
      </div>

      {/* Aggregate Balance Cards */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Assets</p>
            <h3 className="text-3xl font-bold tracking-tight mt-2 text-emerald-500">
              ${totalAssets.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <Landmark className="h-10 w-10 text-emerald-500/20 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-emerald-500/5 rounded-full blur-2xl" />
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm flex items-center justify-between relative overflow-hidden group">
          <div>
            <p className="text-sm font-medium text-muted-foreground">Total Liabilities</p>
            <h3 className="text-3xl font-bold tracking-tight mt-2 text-foreground">
              ${totalLiabilities.toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </h3>
          </div>
          <CreditCard className="h-10 w-10 text-muted-foreground/20 group-hover:scale-110 transition-transform duration-300" />
          <div className="absolute top-0 right-0 -mr-4 -mt-4 w-20 h-20 bg-primary/5 rounded-full blur-2xl" />
        </div>
      </div>

      {/* State Handling */}
      {isLoading ? (
        <AccountSkeletons />
      ) : isError ? (
        <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6 flex items-start gap-4">
          <AlertCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive">Failed to load accounts</h3>
            <p className="text-sm text-destructive/80 mt-1">
              {(error as AxiosError | Error)?.message || "An unexpected error occurred while fetching your accounts."}
            </p>
            <Button variant="outline" size="sm" onClick={() => refetch()} className="mt-4 border-destructive/50 text-destructive hover:bg-destructive/20">
              Try Again
            </Button>
          </div>
        </div>
      ) : accounts?.length === 0 ? (
        <EmptyState />
      ) : (
        <>
          {/* Navigation Filter Tabs */}
          <div className="flex border-b border-border gap-6">
            {(["all", "checking", "savings", "credit"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`pb-3 text-sm font-medium border-b-2 capitalize transition-all ${
                  filter === tab
                    ? "border-primary text-foreground font-semibold"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Accounts List Grid */}
          {filteredAccounts.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredAccounts.map((acc) => (
                <AccountCard key={acc._id} account={acc} />
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              No {filter} accounts found.
            </div>
          )}
        </>
      )}
    </div>
  );
}
