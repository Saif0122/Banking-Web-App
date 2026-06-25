export const APP_METADATA = {
  name: "Apex Bank",
  description: "Modern, secure and scalable digital banking experience",
};

export const ROUTES = {
  // Auth
  LOGIN: "/login",
  REGISTER: "/register",

  // App Dashboard
  DASHBOARD: "/dashboard",
  ACCOUNTS: "/accounts",
  TRANSACTIONS: "/transactions",
  ANALYTICS: "/analytics",
  SETTINGS: "/settings",

  // Admin
  ADMIN_DASHBOARD: "/admin",
  ADMIN_USERS: "/admin/users",
  ADMIN_ACCOUNTS: "/admin/accounts",
  ADMIN_TRANSACTIONS: "/admin/transactions",
  ADMIN_AUDIT_LOGS: "/admin/audit-logs",
};

export const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.DASHBOARD, icon: "LayoutDashboard" },
  { label: "Accounts", href: ROUTES.ACCOUNTS, icon: "CreditCard" },
  { label: "Transactions", href: ROUTES.TRANSACTIONS, icon: "ArrowLeftRight" },
  { label: "Analytics", href: ROUTES.ANALYTICS, icon: "BarChart3" },
  { label: "Settings", href: ROUTES.SETTINGS, icon: "Settings" },
];

export const ADMIN_NAV_ITEMS = [
  { label: "Admin Dashboard", href: ROUTES.ADMIN_DASHBOARD, icon: "LayoutDashboard" },
  { label: "User Management", href: ROUTES.ADMIN_USERS, icon: "Users" },
  { label: "Accounts", href: ROUTES.ADMIN_ACCOUNTS, icon: "CreditCard" },
  { label: "Transactions", href: ROUTES.ADMIN_TRANSACTIONS, icon: "ArrowLeftRight" },
  { label: "Audit Logs", href: ROUTES.ADMIN_AUDIT_LOGS, icon: "ShieldAlert" },
  { label: "Back to App", href: ROUTES.DASHBOARD, icon: "ArrowLeft" },
];
