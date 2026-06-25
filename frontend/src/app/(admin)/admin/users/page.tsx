"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useUsers, useBlockUser, useUnblockUser, useDeleteUser } from "@/hooks/useAdmin";
import { Loader2, ShieldOff, Shield, Trash2, Search } from "lucide-react";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { AdminUser } from "@/types/admin";
import { AnimatedCard } from "@/components/ui/animated-card";

export default function AdminUsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: usersData, isLoading } = useUsers(page, 10, search);

  const blockUser = useBlockUser();
  const unblockUser = useUnblockUser();
  const deleteUser = useDeleteUser();

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    action: "block" | "unblock" | "delete" | null;
    user: AdminUser | null;
  }>({ open: false, action: null, user: null });

  const handleAction = (action: "block" | "unblock" | "delete", user: AdminUser) => {
    setConfirmDialog({ open: true, action, user });
  };

  const executeAction = async () => {
    if (!confirmDialog.user || !confirmDialog.action) return;
    const { id } = confirmDialog.user;
    
    if (confirmDialog.action === "block") {
      await blockUser.mutateAsync(id);
    } else if (confirmDialog.action === "unblock") {
      await unblockUser.mutateAsync(id);
    } else if (confirmDialog.action === "delete") {
      await deleteUser.mutateAsync(id);
    }
  };

  const columns = [
    { header: "Name", accessorKey: "name" as const, cell: (row: AdminUser) => <span className="font-medium">{row.name}</span> },
    { header: "Email", accessorKey: "email" as const },
    { header: "Role", accessorKey: "role" as const, cell: (row: AdminUser) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${row.role === 'admin' ? 'bg-indigo-500/10 text-indigo-500' : 'bg-zinc-800 text-zinc-400'}`}>
        {row.role}
      </span>
    )},
    { header: "Status", accessorKey: "isBlocked" as const, cell: (row: AdminUser) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold uppercase ${row.isBlocked ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
        {row.isBlocked ? 'Blocked' : 'Active'}
      </span>
    )},
    { header: "Actions", accessorKey: "id" as const, cell: (row: AdminUser) => (
      <div className="flex items-center justify-end gap-2">
        {row.isBlocked ? (
           <button onClick={() => handleAction("unblock", row)} className="p-2 text-zinc-400 hover:text-emerald-400 hover:bg-emerald-400/10 rounded-md transition-colors" title="Unblock User">
             <Shield className="h-4 w-4" />
           </button>
        ) : (
           <button onClick={() => handleAction("block", row)} className="p-2 text-zinc-400 hover:text-yellow-500 hover:bg-yellow-500/10 rounded-md transition-colors" title="Block User">
             <ShieldOff className="h-4 w-4" />
           </button>
        )}
        <button onClick={() => handleAction("delete", row)} className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-500/10 rounded-md transition-colors" title="Delete User">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">User Management</h2>
        <p className="text-muted-foreground text-sm mt-1">
          View, block, or delete system users.
        </p>
      </div>

      <AnimatedCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
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
             <DataTable data={usersData?.data || []} columns={columns} />
             <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
               <div>Showing page {usersData?.page || 1} of {usersData?.totalPages || 1}</div>
               <div className="flex gap-2">
                 <button 
                   disabled={page === 1}
                   onClick={() => setPage(p => Math.max(1, p - 1))}
                   className="px-3 py-1 rounded-md bg-zinc-800 disabled:opacity-50"
                 >
                   Previous
                 </button>
                 <button 
                   disabled={page === (usersData?.totalPages || 1)}
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
          confirmDialog.action === 'block' ? 'Block User' :
          confirmDialog.action === 'unblock' ? 'Unblock User' : 'Delete User'
        }
        description={
          confirmDialog.action === 'block' ? `Are you sure you want to block ${confirmDialog.user?.email}? They will not be able to log in.` :
          confirmDialog.action === 'unblock' ? `Are you sure you want to unblock ${confirmDialog.user?.email}? They will regain access.` :
          `Are you sure you want to completely delete ${confirmDialog.user?.email}? This action cannot be undone.`
        }
        variant={confirmDialog.action === 'unblock' ? 'default' : 'destructive'}
        confirmText={
          confirmDialog.action === 'block' ? 'Block' :
          confirmDialog.action === 'unblock' ? 'Unblock' : 'Delete'
        }
        onConfirm={executeAction}
      />
    </div>
  );
}
