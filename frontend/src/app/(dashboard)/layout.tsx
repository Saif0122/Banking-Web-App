"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/providers/auth-provider";
import { ROUTES, NAV_ITEMS } from "@/constants";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Shield,
  Users,
  ArrowLeft,
  LogOut,
  Menu,
  X,
  Landmark,
  Loader2,
  Bell,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard,
  CreditCard,
  ArrowLeftRight,
  BarChart3,
  Settings,
  Shield,
  Users,
  ArrowLeft,
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  // Route protection guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-background text-foreground">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="text-muted-foreground text-sm">Securing session...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Prevents flashing content during redirect
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground selection:bg-primary/20">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r border-sidebar-border bg-sidebar">
        {/* Sidebar Header Brand */}
        <div className="flex h-16 items-center px-6 border-b border-sidebar-border gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
            <Landmark className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg tracking-tight text-sidebar-foreground">Apex Bank</span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 space-y-1.5 px-4 py-6 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutDashboard;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={`h-4 w-4 relative z-10 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"}`} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            );
          })}

          {/* Quick link to admin console if admin */}
          {user.role === "admin" && (
            <>
              <div className="my-4 h-px bg-sidebar-border" />
              <Link
                href={ROUTES.ADMIN_DASHBOARD}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  pathname === ROUTES.ADMIN_DASHBOARD
                    ? "text-primary"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {pathname === ROUTES.ADMIN_DASHBOARD && (
                  <motion.div 
                    layoutId="active-nav"
                    className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Shield className={`h-4 w-4 relative z-10 ${pathname === ROUTES.ADMIN_DASHBOARD ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"}`} />
                <span className="relative z-10">Admin Console</span>
              </Link>
            </>
          )}
        </nav>

        {/* User Card & Logout Footer */}
        <div className="border-t border-sidebar-border p-4">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-soft">
              {user.name.slice(0, 2)}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-semibold truncate text-sidebar-foreground">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              router.push(ROUTES.LOGIN);
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Workspace */}
      <div className="flex flex-col flex-1 md:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background/80 backdrop-blur-xl px-4 md:px-8">
          <div className="flex items-center gap-4 flex-1">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-md hover:bg-muted text-muted-foreground"
              aria-label="Open sidebar"
            >
              <Menu className="h-6 w-6" />
            </button>
            <h1 className="font-semibold text-xl tracking-tight capitalize hidden sm:block">
              {pathname.split("/").filter(Boolean)[0] || "Dashboard"}
            </h1>
            
            {/* Global Search */}
            <div className="hidden md:flex relative w-full max-w-sm ml-8">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search transactions, accounts..." 
                className="w-full bg-muted/50 pl-9 rounded-full border-none h-9 focus-visible:ring-1 focus-visible:ring-primary/50"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative p-2 rounded-full hover:bg-muted text-muted-foreground transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-primary shadow-[0_0_0_2px_hsl(var(--background))]"></span>
            </button>
            <ThemeToggle />
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm md:flex hidden shadow-soft cursor-pointer hover:opacity-90 transition-opacity">
              {user.name.slice(0, 2)}
            </div>
          </div>
        </header>

        {/* Dynamic Canvas Workspace */}
        <main className="flex-1 p-4 md:p-8 bg-muted/20">
          <div className="mx-auto max-w-6xl">{children}</div>
        </main>
      </div>

      {/* Mobile Drawer Slide-out */}
      <AnimatePresence>
        {sidebarOpen && (
          <div className="fixed inset-0 z-50 flex md:hidden" role="dialog" aria-modal="true">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative flex w-full max-w-[280px] flex-1 flex-col bg-sidebar pt-5 pb-4 border-r border-sidebar-border shadow-2xl"
            >
              {/* Close button inside Drawer */}
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent text-sidebar-foreground"
                  aria-label="Close sidebar"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Brand Header */}
              <div className="flex shrink-0 items-center px-6 gap-2 mb-6 mt-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-soft">
                  <Landmark className="h-5 w-5" />
                </div>
                <span className="font-bold text-lg tracking-tight text-sidebar-foreground">Apex Bank</span>
              </div>

              {/* Navigation inside Drawer */}
              <nav className="flex-1 space-y-1.5 px-4 py-2 overflow-y-auto">
                {NAV_ITEMS.map((item) => {
                  const Icon = iconMap[item.icon] || LayoutDashboard;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-sidebar-accent-foreground"}`} />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}

                {user.role === "admin" && (
                  <>
                    <div className="my-4 h-px bg-sidebar-border" />
                    <Link
                      href={ROUTES.ADMIN_DASHBOARD}
                      onClick={() => setSidebarOpen(false)}
                      className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium border border-dashed border-primary/40 text-primary hover:bg-primary/10 transition-colors duration-200"
                    >
                      <Shield className="h-4 w-4" />
                      <span>Admin Console</span>
                    </Link>
                  </>
                )}
              </nav>

              {/* Footer inside Drawer */}
              <div className="border-t border-sidebar-border p-4 mt-auto">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm shadow-soft">
                    {user.name.slice(0, 2)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-sidebar-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[180px]">{user.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    router.push(ROUTES.LOGIN);
                  }}
                  className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors duration-200"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sign out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
