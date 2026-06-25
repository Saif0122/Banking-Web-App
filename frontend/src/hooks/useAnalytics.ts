import { useQuery } from "@tanstack/react-query";
import { analyticsService } from "../services/analytics.service";
import { AnalyticsFilters } from "../types/analytics";

export const ANALYTICS_KEYS = {
  all: ["analytics"] as const,
  summary: (filters?: AnalyticsFilters) => [...ANALYTICS_KEYS.all, "summary", filters] as const,
  monthly: (filters?: AnalyticsFilters) => [...ANALYTICS_KEYS.all, "monthly", filters] as const,
  accountStats: (filters?: AnalyticsFilters) => [...ANALYTICS_KEYS.all, "accountStats", filters] as const,
  recentTransactions: (filters?: AnalyticsFilters) => [...ANALYTICS_KEYS.all, "recentTransactions", filters] as const,
};

export const useDashboardSummary = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.summary(filters),
    queryFn: () => analyticsService.getDashboardSummary(filters),
  });
};

export const useMonthlyAnalytics = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.monthly(filters),
    queryFn: () => analyticsService.getMonthlyAnalytics(filters),
  });
};

export const useAccountStats = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.accountStats(filters),
    queryFn: () => analyticsService.getAccountStats(filters),
  });
};

export const useRecentTransactions = (filters?: AnalyticsFilters) => {
  return useQuery({
    queryKey: ANALYTICS_KEYS.recentTransactions(filters),
    queryFn: () => analyticsService.getRecentTransactions(filters),
  });
};
