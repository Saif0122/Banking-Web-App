"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ROUTES, ADMIN_NAV_ITEMS } from "@/constants";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import {
  LayoutDashboard,
  ShieldAlert,
  Users,
  ArrowLeft,
  Menu,
  X,
  Landmark,
  Loader2,
  Shield,
  LogOut,
  CreditCard,
  ArrowLeftRight,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Shield,
  Users,
  ArrowLeft,
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  ShieldAlert,
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Role verification guard
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(ROUTES.LOGIN);
      } else if (user?.role !== "admin") {
        router.push(ROUTES.DASHBOARD); // Redirect non-admins to main app dashboard
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-destructive" />
          <p className="text-muted-foreground text-sm">Verifying permissions...</p>
        </div>
      </div>
    );
  }

  // Deny render if permissions check is unsuccessful
  if (!user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-zinc-950 text-zinc-100 dark">
      {/* Sidebar for Desktop Admin */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-zinc-800 bg-zinc-900">
        {/* Brand Header */}
        <div className="flex h-16 items-center px-6 border-b border-zinc-800 gap-2">
          <Landmark className="h-6 w-6 text-red-500" />
          <span className="font-bold text-lg tracking-tight text-white">Apex Admin</span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 px-4 py-4">
          <div className="px-3 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            System Administration
          </div>
          {ADMIN_NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                  isActive
                    ? "bg-red-600 text-white"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer info */}
        <div className="border-t border-zinc-800 p-4 bg-zinc-900/60">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/10 text-red-500 font-bold text-sm">
              AD
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold text-white truncate">{user.name}</p>
              <p className="text-xs text-zinc-500 truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push(ROUTES.LOGIN);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex flex-col flex-1 md:pl-64">
        {/* Warning Banner */}
        <div className="flex h-10 w-full items-center justify-center gap-2 bg-red-950 border-b border-red-900 px-4 text-center text-xs font-semibold text-red-200">
          <ShieldAlert className="h-4 w-4 shrink-0 text-red-400 animate-pulse" />
          <span>Security Alert: You are inside the Admin System Control panel. Actions are logged.</span>
        </div>

        {/* Top Navbar */}
        <header className="sticky top-10 z-40 flex h-16 shrink-0 items-center justify-between border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-md px-4 md:px-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-zinc-800 text-zinc-400"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-semibold text-lg tracking-tight text-white capitalize">
              Admin console / {pathname.split("/").pop() || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Dynamic Canvas Workspace */}
        <main className="flex-1 p-4 md:p-6 bg-zinc-950">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {/* Mobile Drawer Slide-out */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
          {/* Backdrop overlay */}
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
          />

          <div className="relative flex w-full max-w-xs flex-1 flex-col bg-zinc-900 pt-5 pb-4 border-r border-zinc-800 animate-in slide-in-from-left duration-200">
            {/* Close button inside Drawer */}
            <div className="absolute top-2 right-2">
              <button
                onClick={() => setSidebarOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-md hover:bg-zinc-800 text-zinc-400"
                aria-label="Close sidebar"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Brand Header */}
            <div className="flex shrink-0 items-center px-6 gap-2 mb-4">
              <Landmark className="h-6 w-6 text-red-500" />
              <span className="font-bold text-lg tracking-tight text-white">Apex Admin</span>
            </div>

            {/* Navigation inside Drawer */}
            <nav className="flex-1 space-y-1 px-4 py-4">
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon] || LayoutDashboard;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "bg-red-600 text-white"
                        : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            {/* Footer inside Drawer */}
            <div className="border-t border-zinc-800 p-4 bg-zinc-900/40 mt-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-red-600/10 text-red-500 font-bold text-sm">
                  AD
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{user.name}</p>
                  <p className="text-xs text-zinc-500 truncate max-w-[180px]">{user.email}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  logout();
                  router.push(ROUTES.LOGIN);
                }}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
