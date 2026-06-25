"use client";

import React from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Transaction } from "@/types";
import { useAccounts } from "@/hooks/useAccounts";

interface TransactionDetailsModalProps {
  transaction: Transaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TransactionDetailsModal({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsModalProps) {
  const { data: accounts } = useAccounts();

  if (!transaction) return null;

  const isDebit = transaction.type === "withdrawal" || transaction.type === "transfer";
  const amountPrefix = isDebit ? "-" : "+";
  const amountColor = isDebit ? "text-foreground" : "text-emerald-600";

  const sourceAccount = accounts?.find(a => a._id === transaction.accountId);
  const destAccount = transaction.toAccountId
    ? accounts?.find(a => a._id === transaction.toAccountId)
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Transaction Details</DialogTitle>
          <DialogDescription>
            Reference: {transaction.id || transaction._id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          <div className="flex flex-col items-center justify-center p-6 bg-muted/20 rounded-xl border border-border">
            <span className="text-sm text-muted-foreground uppercase tracking-wider font-semibold mb-1">
              {transaction.type}
            </span>
            <span className={`text-4xl font-bold ${amountColor}`}>
              {amountPrefix}${Math.abs(transaction.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}
            </span>
            <span className="mt-2 inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-foreground capitalize">
              {transaction.status}
            </span>
          </div>

          <div className="grid gap-4 text-sm">
            <div className="grid grid-cols-3 gap-4 border-b border-border pb-4">
              <span className="text-muted-foreground font-medium">Date</span>
              <span className="col-span-2 text-right">
                {format(new Date(transaction.createdAt), "MMMM d, yyyy 'at' h:mm a")}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b border-border pb-4">
              <span className="text-muted-foreground font-medium">Description</span>
              <span className="col-span-2 text-right">{transaction.description}</span>
            </div>

            <div className="grid grid-cols-3 gap-4 border-b border-border pb-4">
              <span className="text-muted-foreground font-medium">Account</span>
              <span className="col-span-2 text-right">
                {sourceAccount ? `${sourceAccount.name} (*${sourceAccount.accountNumber?.slice(-4) || '****'})` : transaction.accountId}
              </span>
            </div>

            {transaction.toAccountId && (
              <div className="grid grid-cols-3 gap-4 border-b border-border pb-4">
                <span className="text-muted-foreground font-medium">To Account</span>
                <span className="col-span-2 text-right">
                  {destAccount ? `${destAccount.name} (*${destAccount.accountNumber?.slice(-4) || '****'})` : transaction.toAccountId}
                </span>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
