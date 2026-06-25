import { User } from "./index";

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminOverview {
  totalUsers: number;
  totalAccounts: number;
  totalTransactions: number;
  totalFunds: number;
  activeAccounts: number;
  frozenAccounts: number;
  blockedUsers: number;
}

export interface AuditLog {
  id: string;
  _id?: string;
  action: string;
  userId?: string | User;
  ipAddress: string;
  metadata?: Record<string, unknown>;
  timestamp: string;
  createdAt?: string;
}

// Extending User type to represent full user data for admin
export interface AdminUser extends User {
  isBlocked: boolean;
}
