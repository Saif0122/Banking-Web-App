"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { Search, ShieldCheck, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { Transaction } from "@/types";
import { useAccounts } from "@/hooks/useAccounts";

interface TransactionTableProps {
  transactions: Transaction[];
  isLoading: boolean;
  onRowClick: (transaction: Transaction) => void;
}

export function TransactionTable({ transactions, isLoading, onRowClick }: TransactionTableProps) {
  const { data: accounts } = useAccounts();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter transactions
  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.description.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper to get account name
  const getAccountName = (accountId: string) => {
    if (!accounts) return accountId;
    const acc = accounts.find((a) => a._id === accountId);
    return acc ? acc.name : accountId;
  };

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-card border border-border rounded-xl p-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search descriptions..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            className="pl-9 pr-4 py-2 w-full text-sm rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>

        <div className="flex w-full md:w-auto gap-2">
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 md:flex-none border border-input bg-background px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Types</option>
            <option value="deposit">Deposit</option>
            <option value="withdrawal">Withdrawal</option>
            <option value="transfer">Transfer</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="flex-1 md:flex-none border border-input bg-background px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">All Statuses</option>
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-muted-foreground text-xs font-semibold uppercase tracking-wider">
                <th className="p-4">Transaction Details</th>
                <th className="p-4">Account</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
                    <p className="mt-2 text-muted-foreground">Loading transactions...</p>
                  </td>
                </tr>
              ) : paginatedTransactions.length > 0 ? (
                paginatedTransactions.map((tx) => {
                  const isDebit = tx.type === "withdrawal" || tx.type === "transfer";
                  return (
                    <tr
                      key={tx.id || tx._id}
                      onClick={() => onRowClick(tx)}
                      className="hover:bg-muted/30 transition-colors cursor-pointer"
                    >
                      <td className="p-4">
                        <p className="font-medium text-foreground">{tx.description}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {format(new Date(tx.createdAt), "MMM dd, yyyy")}
                        </p>
                      </td>
                      <td className="p-4 text-muted-foreground">{getAccountName(tx.accountId)}</td>
                      <td className="p-4">
                        <span className="inline-flex items-center rounded-md bg-secondary px-2 py-1 text-xs font-medium text-muted-foreground capitalize">
                          {tx.type}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium ${
                            tx.status === "completed"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : tx.status === "failed"
                              ? "bg-destructive/10 text-destructive"
                              : "bg-amber-500/10 text-amber-600"
                          }`}
                        >
                          {tx.status === "completed" && <ShieldCheck className="h-3 w-3" />}
                          <span className="capitalize">{tx.status}</span>
                        </span>
                      </td>
                      <td className={`p-4 text-right font-semibold ${isDebit ? "text-foreground" : "text-emerald-600"}`}>
                        {isDebit ? "-" : "+"}${Math.abs(tx.amount).toLocaleString("en-US", {
                          minimumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-muted-foreground">
                    <p>No transactions matching criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center bg-card border border-border rounded-xl p-3 shadow-sm">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{" "}
            <span className="font-medium">
              {Math.min(currentPage * itemsPerPage, filteredTransactions.length)}
            </span>{" "}
            of <span className="font-medium">{filteredTransactions.length}</span> results
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-input bg-background hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
