"use client";

import React, { useState } from "react";
import { Download, PlusCircle, MinusCircle, ArrowRightLeft } from "lucide-react";
import { useTransactions } from "@/features/transactions/api/useTransactions";
import { TransactionTable } from "@/features/transactions/components/TransactionTable";
import { DepositModal } from "@/features/transactions/components/DepositModal";
import { WithdrawModal } from "@/features/transactions/components/WithdrawModal";
import { TransferModal } from "@/features/transactions/components/TransferModal";
import { TransactionDetailsModal } from "@/features/transactions/components/TransactionDetailsModal";
import { Transaction } from "@/types";

export default function TransactionsPage() {
  const { data: transactions = [], isLoading } = useTransactions(null);

  const [depositOpen, setDepositOpen] = useState(false);
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);
  
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Compute Summary Statistics
  const totalBalance = transactions.reduce((sum, tx) => {
    return tx.type === "deposit" ? sum + tx.amount : sum - tx.amount;
  }, 0);
  const recentDeposits = transactions.filter(tx => tx.type === "deposit").slice(0, 5).reduce((s, tx) => s + tx.amount, 0);
  const recentWithdrawals = transactions.filter(tx => tx.type === "withdrawal").slice(0, 5).reduce((s, tx) => s + tx.amount, 0);

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Transactions Center</h2>
          <p className="text-muted-foreground text-sm mt-1">
            Manage your money, view history, and perform quick actions securely.
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded-lg border border-border bg-card hover:bg-muted font-semibold px-4 py-2 text-sm shadow transition-all">
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">Export Ledger</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Net Flow (All Time)</p>
          <h3 className="text-2xl font-bold mt-2">
            ${totalBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Recent Deposits (Last 5)</p>
          <h3 className="text-2xl font-bold mt-2 text-emerald-600">
            +${recentDeposits.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </h3>
        </div>
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Recent Withdrawals (Last 5)</p>
          <h3 className="text-2xl font-bold mt-2 text-destructive">
            -${recentWithdrawals.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </h3>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-wrap gap-4">
        <button
          onClick={() => setDepositOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-3 text-sm shadow transition-all"
        >
          <PlusCircle className="h-5 w-5" />
          Deposit Funds
        </button>
        <button
          onClick={() => setWithdrawOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 py-3 text-sm shadow transition-all"
        >
          <MinusCircle className="h-5 w-5" />
          Withdraw Funds
        </button>
        <button
          onClick={() => setTransferOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-3 text-sm shadow transition-all"
        >
          <ArrowRightLeft className="h-5 w-5" />
          Transfer
        </button>
      </div>

      {/* Transaction Table */}
      <div>
        <h3 className="text-xl font-bold tracking-tight mb-4">Transaction History</h3>
        <TransactionTable
          transactions={transactions}
          isLoading={isLoading}
          onRowClick={(tx) => setSelectedTransaction(tx)}
        />
      </div>

      {/* Modals */}
      <DepositModal open={depositOpen} onOpenChange={setDepositOpen} />
      <WithdrawModal open={withdrawOpen} onOpenChange={setWithdrawOpen} />
      <TransferModal open={transferOpen} onOpenChange={setTransferOpen} />
      
      <TransactionDetailsModal
        transaction={selectedTransaction}
        open={!!selectedTransaction}
        onOpenChange={(open) => {
          if (!open) setSelectedTransaction(null);
        }}
      />
    </div>
  );
}
