import React from "react";
import { CreateAccountForm } from "@/components/forms/CreateAccountForm";
import { AnimatedCard } from "@/components/ui/animated-card";

export default function CreateAccountPage() {
  return (
    <div className="max-w-xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Open New Account</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Choose the right account for your financial goals. Fast, secure, and ready in seconds.
        </p>
      </div>

      <AnimatedCard className="p-6 md:p-8 relative overflow-hidden">
        {/* Subtle gradient background */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10">
          <CreateAccountForm />
        </div>
      </AnimatedCard>
    </div>
  );
}
