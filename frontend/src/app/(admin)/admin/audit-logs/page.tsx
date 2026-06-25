"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { useAuditLogs } from "@/hooks/useAdmin";
import { Loader2, Search, Server, FileJson } from "lucide-react";
import { AuditLog } from "@/types/admin";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export default function AdminAuditLogsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  
  const { data: logsData, isLoading } = useAuditLogs(page, 15, search);
  
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const columns = [
    { header: "Timestamp", accessorKey: "timestamp" as const, cell: (row: AuditLog) => <span className="text-muted-foreground font-mono text-xs">{new Date(row.timestamp || row.createdAt || "").toLocaleString()}</span> },
    { header: "Action", accessorKey: "action" as const, cell: (row: AuditLog) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-indigo-500/10 text-indigo-400">
        {row.action}
      </span>
    )},
    { header: "User ID", accessorKey: "userId" as const, cell: (row: AuditLog) => {
      const uid = typeof row.userId === 'object' ? row.userId?.id : row.userId;
      return <span className="text-primary font-mono text-xs">[{uid || "System"}]</span>
    }},
    { header: "IP Address", accessorKey: "ipAddress" as const, cell: (row: AuditLog) => <span className="text-sm">{row.ipAddress}</span> },
    { header: "Metadata", accessorKey: "id" as const, cell: (row: AuditLog) => (
      <button 
        onClick={() => setSelectedLog(row)} 
        disabled={!row.metadata}
        className="p-1.5 text-zinc-400 hover:text-emerald-500 hover:bg-emerald-500/10 rounded-md transition-colors disabled:opacity-30" 
        title="View Metadata"
      >
        <FileJson className="h-4 w-4" />
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Audit Logs</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Review system activities, access logs, and administrative actions.
        </p>
      </div>

      <AnimatedCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search actions or IP addresses..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-background border border-zinc-800 rounded-md py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <span className="flex items-center gap-1.5 text-xs text-emerald-500 bg-emerald-500/10 px-2.5 py-1 rounded-full font-medium">
            <Server className="h-3 w-3" />
            <span>Recording Active</span>
          </span>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
             <DataTable data={logsData?.data || []} columns={columns} />
             <div className="flex items-center justify-between mt-4 text-sm text-muted-foreground">
               <div>Showing page {logsData?.page || 1} of {logsData?.totalPages || 1}</div>
               <div className="flex gap-2">
                 <button 
                   disabled={page === 1}
                   onClick={() => setPage(p => Math.max(1, p - 1))}
                   className="px-3 py-1 rounded-md bg-zinc-800 disabled:opacity-50"
                 >
                   Previous
                 </button>
                 <button 
                   disabled={page === (logsData?.totalPages || 1)}
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

      <Dialog open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Log Metadata</DialogTitle>
            <DialogDescription>
              Technical details payload attached to this audit log.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-zinc-950 p-4 rounded-md border border-zinc-800 overflow-x-auto">
            <pre className="text-xs text-emerald-400 font-mono">
              {selectedLog?.metadata ? JSON.stringify(selectedLog.metadata, null, 2) : "No metadata available."}
            </pre>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
