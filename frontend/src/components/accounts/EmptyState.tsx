import React from "react";
import Link from "next/link";
import { Plus, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-2xl border border-dashed border-border bg-card/50">
      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
        <Wallet className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-2xl font-bold tracking-tight mb-2">No Accounts Found</h3>
      <p className="text-muted-foreground max-w-md mx-auto mb-8">
        You haven&apos;t opened any bank accounts yet. Create your first account to start managing your finances, tracking your spending, and growing your wealth.
      </p>
      <Link href="/accounts/create" passHref>
        <Button size="lg" className="gap-2 font-semibold shadow-lg shadow-primary/20">
          <Plus className="h-5 w-5" />
          Create First Account
        </Button>
      </Link>
    </div>
  );
}
