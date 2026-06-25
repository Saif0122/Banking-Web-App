export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type AccountType = "checking" | "savings" | "credit";

export interface Account {
  _id: string;
  owner: string | User;
  name: string;
  type?: AccountType; // For compatibility if used anywhere
  accountType: AccountType;
  balance: number;
  accountNumber: string;
  status: "active" | "frozen" | "closed";
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAccountPayload {
  name: string;
  accountType: AccountType;
  initialDeposit: number;
}

export type TransactionType = "deposit" | "withdrawal" | "transfer";
export type TransactionStatus = "pending" | "completed" | "failed";

export interface Transaction {
  id: string;
  _id?: string;
  accountId: string;
  type: TransactionType;
  amount: number;
  description: string;
  status: TransactionStatus;
  category: string;
  toAccountId?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
