import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/services/api-client";
import { Transaction, Account } from "@/types";
import { DepositFormData, WithdrawFormData, TransferFormData } from "../schemas/transaction.schema";

interface TransactionsResponse {
  success: boolean;
  transactions: Transaction[];
}

// Helper to fetch transactions for a single account
const fetchAccountTransactions = async (accountId: string): Promise<Transaction[]> => {
  const { data } = await apiClient.get<TransactionsResponse>(`/transactions/account/${accountId}`);
  return data.transactions;
};

export function useTransactions(accountId?: string | null) {
  return useQuery({
    queryKey: ["transactions", accountId || "all"],
    queryFn: async () => {
      if (accountId && accountId !== "all") {
        return fetchAccountTransactions(accountId);
      }

      const { data } = await apiClient.get<TransactionsResponse>("/transactions");
      return data.transactions;
    },
  });
}

export function useDeposit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: DepositFormData) => {
      const { data } = await apiClient.post("/transactions/deposit", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: WithdrawFormData) => {
      const { data } = await apiClient.post("/transactions/withdraw", payload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}

export function useTransfer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: TransferFormData) => {
      const mappedPayload = {
        senderAccountId: payload.fromAccountId,
        receiverAccountId: payload.toAccountId,
        amount: payload.amount,
        description: payload.description,
      };
      const { data } = await apiClient.post("/transactions/transfer", mappedPayload);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
  });
}
