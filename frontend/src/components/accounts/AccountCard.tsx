import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, ShieldAlert } from "lucide-react";
import { Account } from "@/types";
import { cn } from "@/lib/utils";
import { AnimatedCard } from "@/components/ui/animated-card";
import { Button } from "@/components/ui/button";

interface AccountCardProps {
  account: Account;
}

export function AccountCard({ account }: AccountCardProps) {
  const isNegative = account.balance < 0;
  const isActive = account.status === "active";

  return (
    <AnimatedCard className="flex flex-col justify-between overflow-hidden group">
      {/* Top Section */}
      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h4 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
              {account.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5 tracking-wider font-mono">
              •••• {account.accountNumber.slice(-4)}
            </p>
          </div>
          <div
            className={cn(
              "rounded-full px-2 py-0.5 text-[10px] font-semibold flex items-center gap-1",
              isActive
                ? "bg-emerald-500/10 text-emerald-500"
                : "bg-amber-500/10 text-amber-500"
            )}
          >
            {isActive ? (
              <ShieldCheck className="h-3 w-3" />
            ) : (
              <ShieldAlert className="h-3 w-3" />
            )}
            <span className="capitalize">{account.status}</span>
          </div>
        </div>

        {/* Balance */}
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground mb-1">Available Balance</span>
          <div className="text-3xl font-bold tracking-tight">
            {isNegative ? "-" : ""}$
            {Math.abs(account.balance).toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-border pt-4 mt-6 flex justify-between items-center relative z-10">
        <span className="text-xs font-medium text-muted-foreground capitalize bg-secondary/50 px-2 py-1 rounded-md">
          {account.accountType} account
        </span>
        <Link href={`/accounts/${account._id}`} passHref>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs font-semibold text-primary hover:bg-primary/10">
            <span>Details</span>
            <ArrowRight className="h-3 w-3" />
          </Button>
        </Link>
      </div>
      
      {/* Gradient Background Accent */}
      <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 rounded-full bg-primary/5 blur-3xl group-hover:bg-primary/10 transition-all duration-500" />
    </AnimatedCard>
  );
}
