import React from "react";
import { ShieldCheck, TrendingUp, Landmark } from "lucide-react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col md:flex-row">
      {/* Brand Side (Visible on MD and larger) */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-zinc-950 p-10 text-white dark:border-r md:flex">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-radial-[circle_at_top_right] from-primary/30 via-zinc-950 to-zinc-950" />

        {/* Branding header */}
        <div className="relative z-20 flex items-center gap-2 text-lg font-semibold tracking-tight">
          <Landmark className="h-6 w-6 text-primary" />
          <span>Apex Bank</span>
        </div>

        {/* Dynamic Marketing Content */}
        <div className="relative z-20 my-auto max-w-md space-y-6">
          <h1 className="text-4xl font-bold leading-tight tracking-tight">
            The next generation of digital wealth management.
          </h1>
          <p className="text-zinc-400 text-lg">
            Manage checking, savings, investment accounts, and track transactions in real-time with enterprise-grade encryption.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-900 p-2 border border-zinc-800">
                <ShieldCheck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Bank-grade Security</p>
                <p className="text-zinc-500 text-sm">256-bit AES encryption & MFA protection</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-zinc-900 p-2 border border-zinc-800">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">Real-Time Insights</p>
                <p className="text-zinc-500 text-sm">Track deposits, transfers, and budgets instantly</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-20 text-zinc-500 text-sm">
          &copy; {new Date().getFullYear()} Apex Bank Inc. All rights reserved.
        </div>
      </div>

      {/* Main form side */}
      <div className="flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24 bg-card">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          {/* Mobile view branding */}
          <div className="flex items-center gap-2 md:hidden mb-8">
            <Landmark className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl tracking-tight">Apex Bank</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
