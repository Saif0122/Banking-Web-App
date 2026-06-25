"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useAccounts, useFreezeAccount, useActivateAccount, useCloseAccount } from "@/hooks/useAdmin";
import { Loader2, Search, Snowflake, CheckCircle, XOctagon } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { Account } from "@/types";
import { AnimatedCard } from "@/components/ui/animated-card";

export default function AdminAccountsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: accountsData, isLoading } = useAccounts(page, 10, search);

  const freezeAccount = useFreezeAccount();
  const activateAccount = useActivateAccount();
  const closeAccount = useCloseAccount();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "freeze" | "activate" | "close" | null;
    account: Account | null;
  }>({ open: false, action: null, account: null });

  const handleAction = (action: "freeze" | "activate" | "close", account: Account) => {
    setConfirmDialog({ open: true, action, account });
  };

  const executeAction = async () => {
    if (!confirmDialog.account || !confirmDialog.action) return;
    const { _id } = confirmDialog.account;
    
    if (confirmDialog.action === "freeze") {
      await freezeAccount.mutateAsync(_id);
    } else if (confirmDialog.action === "activate") {
      await activateAccount.mutateAsync(_id);
    } else if (confirmDialog.action === "close") {
      await closeAccount.mutateAsync(_id);
    }
  };

  const columns = [
    { header: "Account Number", accessorKey: "accountNumber" as const, cell: (row: Account) => <span className="font-mono">{row.accountNumber}</span> },
    { header: "Owner", accessorKey: "owner" as const, cell: (row: Account) => <span>{typeof row.owner === 'object' ? row.owner.name : row.owner}</span> },
    { header: "Type", accessorKey: "accountType" as const, cell: (row: Account) => <span className="capitalize">{row.accountType}</span> },
    { header: "Balance", accessorKey: "balance" as const, cell: (row: Account) => <span className="font-semibold text-emerald-500">${row.balance.toLocaleString()}</span> },
    { header: "Status", accessorKey: "status" as const, cell: (row: Account) => {
      const colors = {
        active: "bg-emerald-500/10 text-emerald-500",
        frozen: "bg-blue-500/10 text-blue-500",
        closed: "bg-zinc-800 text-zinc-400"
      };
      return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${colors[row.status]}`}>
          {row.status}
        </span>
      );
    }},
    { header: "Actions", accessorKey: "_id" as const, cell: (row: Account) => (
      <div className="flex items-center justify-end gap-2">
        {row.status === "active" && (
           <button onClick={() => handleAction("freeze", row)} className="p-2 text-zinc-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-md transition-colors" title="Freeze Account">
             <Snowflake className="h-4 w-4" />
           </button>
        )}
        {row.status === "frozen" && (
           <button onClick={() => handleAction("activate", row)} className="p-2 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors" title="Activate Account">
             <CheckCircle className="h-4 w-4" />
           </button>
        )}
        {row.status !== "closed" && (
          <button onClick={() => handleAction("close", row)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors" title="Close Account">
            <XOctagon className="h-4 w-4" />
          </button>
        )}
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Account Management</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Monitor balances, freeze suspicious accounts, or close them.
        </p>
      </div>

      <AnimatedCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search by account number..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-zinc-800 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
             <DataTable data={accountsData?.data || []} columns={columns} />
             <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
               <div>Showing page {accountsData?.page || 1} of {accountsData?.totalPages || 1}</div>
               <div className="flex gap-2">
                 <button 
                   disabled={page === 1}
                   onClick={() => setPage(p => Math.max(1, p - 1))}
                   className="px-3 py-1 rounded-md bg-zinc-800 disabled:opacity-50"
                 >
                   Previous
                 </button>
                 <button 
                   disabled={page === (accountsData?.totalPages || 1)}
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

      <ConfirmationDialog 
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog(prev => ({ ...prev, open }))}
        title={
          confirmDialog.action === 'freeze' ? 'Freeze Account' :
          confirmDialog.action === 'activate' ? 'Activate Account' : 'Close Account'
        }
        description={
          confirmDialog.action === 'freeze' ? `Are you sure you want to freeze account ${confirmDialog.account?.accountNumber}? Outgoing transactions will be blocked.` :
          confirmDialog.action === 'activate' ? `Are you sure you want to activate account ${confirmDialog.account?.accountNumber}? It will resume normal operations.` :
          `Are you sure you want to close account ${confirmDialog.account?.accountNumber}? This is a permanent action.`
        }
        variant={confirmDialog.action === 'activate' ? 'default' : 'destructive'}
        confirmText={
          confirmDialog.action === 'freeze' ? 'Freeze' :
          confirmDialog.action === 'activate' ? 'Activate' : 'Close Account'
        }
        onConfirm={executeAction}
      />
    </div>
  );
}
