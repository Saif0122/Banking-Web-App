import { apiClient } from "./api-client";
import {
  DashboardSummary,
  MonthlyAnalyticsResponse,
  AccountStats,
  RecentTransactionsResponse,
  AnalyticsFilters,
} from "../types/analytics";

export const analyticsService = {
  getDashboardSummary: async (filters?: AnalyticsFilters): Promise<DashboardSummary> => {
    const response = await apiClient.get<{ success: boolean; data: DashboardSummary }>("/dashboard/summary", {
      params: filters,
    });
    return response.data.data;
  },

  getMonthlyAnalytics: async (filters?: AnalyticsFilters): Promise<MonthlyAnalyticsResponse> => {
    const response = await apiClient.get<{ success: boolean; data: any[] }>("/dashboard/monthly-analytics", {
      params: filters,
    });
    return { data: response.data.data };
  },

  getAccountStats: async (filters?: AnalyticsFilters): Promise<AccountStats> => {
    const response = await apiClient.get<{ success: boolean; data: AccountStats }>("/dashboard/account-stats", {
      params: filters,
    });
    return response.data.data;
  },

  getRecentTransactions: async (filters?: AnalyticsFilters): Promise<RecentTransactionsResponse> => {
    const response = await apiClient.get<{ success: boolean; data: any[] }>("/dashboard/recent-transactions", {
      params: filters,
    });
    return { transactions: response.data.data };
  },
};
