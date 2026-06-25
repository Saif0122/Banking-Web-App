export interface DashboardSummary {
  totalAccounts: number;
  activeAccounts: number;
  totalBalance: number;
  totalTransactions: number;
}

export interface MonthlyAnalyticsData {
  month: string;
  deposits: number;
  withdrawals: number;
  transfers: number;
}

export interface MonthlyAnalyticsResponse {
  data: MonthlyAnalyticsData[];
}

export interface AccountStats {
  savingsAccounts: number;
  currentAccounts: number;
  activeAccounts: number;
  frozenAccounts: number;
}

export interface AnalyticsTransaction {
  id: string;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
  status: "COMPLETED" | "PENDING" | "FAILED";
  date: string;
  description: string;
  accountId: string;
}

export interface RecentTransactionsResponse {
  transactions: AnalyticsTransaction[];
}

export interface AnalyticsFilters {
  dateRange?: {
    from?: string | Date;
    to?: string | Date;
  };
  type?: "ALL" | "DEPOSIT" | "WITHDRAWAL" | "TRANSFER";
}
