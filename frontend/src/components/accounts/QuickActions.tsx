import React from "react";
import { ArrowDownToLine, ArrowUpFromLine, ArrowRightLeft, History } from "lucide-react";
import { Button } from "@/components/ui/button";

interface QuickActionsProps {
  accountId: string;
}

export function QuickActions({ accountId: _accountId }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Button
        variant="outline"
        className="h-24 flex-col gap-3 hover:bg-emerald-500/10 hover:text-emerald-600 hover:border-emerald-500/50 transition-all"
        onClick={() => alert("Deposit workflow to be implemented")}
      >
        <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
          <ArrowDownToLine className="h-5 w-5" />
        </div>
        <span className="font-semibold">Deposit</span>
      </Button>

      <Button
        variant="outline"
        className="h-24 flex-col gap-3 hover:bg-rose-500/10 hover:text-rose-600 hover:border-rose-500/50 transition-all"
        onClick={() => alert("Withdraw workflow to be implemented")}
      >
        <div className="h-10 w-10 rounded-full bg-rose-500/10 flex items-center justify-center">
          <ArrowUpFromLine className="h-5 w-5" />
        </div>
        <span className="font-semibold">Withdraw</span>
      </Button>

      <Button
        variant="outline"
        className="h-24 flex-col gap-3 hover:bg-blue-500/10 hover:text-blue-600 hover:border-blue-500/50 transition-all"
        onClick={() => alert("Transfer workflow to be implemented")}
      >
        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
          <ArrowRightLeft className="h-5 w-5" />
        </div>
        <span className="font-semibold">Transfer</span>
      </Button>

      <Button
        variant="outline"
        className="h-24 flex-col gap-3 hover:bg-primary/10 hover:text-primary hover:border-primary/50 transition-all"
        onClick={() => alert("History workflow to be implemented")}
      >
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <History className="h-5 w-5" />
        </div>
        <span className="font-semibold">History</span>
      </Button>
    </div>
  );
}
