import { apiClient } from "./api-client";
import { AdminOverview, PaginatedResponse, AuditLog, AdminUser } from "@/types/admin";
import { Account, Transaction } from "@/types";

export const AdminService = {
  // Overview
  getOverview: async (): Promise<AdminOverview> => {
    const { data } = await apiClient.get("/admin/overview");
    return data;
  },

  // Users
  getUsers: async (page = 1, limit = 10, search?: string): Promise<PaginatedResponse<AdminUser>> => {
    const { data } = await apiClient.get("/admin/users", {
      params: { page, limit, search },
    });
    return data;
  },
  getUser: async (id: string): Promise<AdminUser> => {
    const { data } = await apiClient.get(`/admin/users/${id}`);
    return data;
  },
  blockUser: async (id: string): Promise<AdminUser> => {
    const { data } = await apiClient.patch(`/admin/users/${id}/block`);
    return data;
  },
  unblockUser: async (id: string): Promise<AdminUser> => {
    const { data } = await apiClient.patch(`/admin/users/${id}/unblock`);
    return data;
  },
  deleteUser: async (id: string): Promise<void> => {
    await apiClient.delete(`/admin/users/${id}`);
  },

  // Accounts
  getAccounts: async (page = 1, limit = 10, search?: string): Promise<PaginatedResponse<Account>> => {
    const { data } = await apiClient.get("/admin/accounts", {
      params: { page, limit, search },
    });
    return data;
  },
  freezeAccount: async (id: string): Promise<Account> => {
    const { data } = await apiClient.patch(`/admin/accounts/${id}/freeze`);
    return data;
  },
  activateAccount: async (id: string): Promise<Account> => {
    const { data } = await apiClient.patch(`/admin/accounts/${id}/activate`);
    return data;
  },
  closeAccount: async (id: string): Promise<Account> => {
    const { data } = await apiClient.patch(`/admin/accounts/${id}/close`);
    return data;
  },

  // Transactions
  getTransactions: async (page = 1, limit = 10): Promise<PaginatedResponse<Transaction>> => {
    const { data } = await apiClient.get("/admin/transactions", {
      params: { page, limit },
    });
    return data;
  },
  searchTransactions: async (
    page = 1,
    limit = 10,
    type?: string,
    status?: string,
    search?: string
  ): Promise<PaginatedResponse<Transaction>> => {
    const { data } = await apiClient.get("/admin/transactions/search", {
      params: { page, limit, type, status, search },
    });
    return data;
  },
  getTransaction: async (id: string): Promise<Transaction> => {
    const { data } = await apiClient.get(`/admin/transactions/${id}`);
    return data;
  },

  // Audit Logs
  getAuditLogs: async (page = 1, limit = 10, search?: string): Promise<PaginatedResponse<AuditLog>> => {
    const { data } = await apiClient.get("/admin/audit-logs", {
      params: { page, limit, search },
    });
    return data;
  },
};
